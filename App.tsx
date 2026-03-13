
import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LanguageSelector from './components/LanguageSelector';
import AuthModal from './components/AuthModal';
import WeatherView from './components/WeatherView';
import HistoryView from './components/HistoryView';
import ReportCard from './components/ReportCard';
import AdminUserList from './components/AdminUserList';
import DocsView from './components/DocsView';
import LearningCenter from './components/LearningCenter';
import CropLibrary from './components/CropLibrary';
import VoiceSettings from './components/VoiceSettings';
import Avatar from './components/Avatar';
import { AppView, User, ChatMessage as ChatMessageType, BotResponse, FarmerReport } from './types.ts';
import { sendChatMessage } from './services/geminiService';
import { saveUserHistory, loadUserHistory, saveReport, initDB, deleteSpecificChat, deleteAllChats, deleteSelectedMessages } from './services/dbService';
import { Smile, Sprout, Trash2, Check } from 'lucide-react';

const APP_LANG_KEY = 'kisan_app_language';

const App: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(localStorage.getItem(APP_LANG_KEY));
  const [view, setView] = useState<AppView | 'LANDING' | 'LANGUAGE_SELECT'>('LANDING');
  const [targetView, setTargetView] = useState<AppView | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Analyzing...");
  const [activeReport, setActiveReport] = useState<FarmerReport | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initDB();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, view]);

  useEffect(() => {
    console.log('Messages updated:', messages.length, messages.map(m => m.id));
  }, [messages]);

  useEffect(() => {
    if (user) {
      loadUserHistory(user.id).then(h => setMessages(h));
    } else {
      setMessages([]);
    }
  }, [user]);

  const handleSend = async (text: string, image: string | null, audio: string | null) => {
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: { text, imageUri: image || undefined, audioUri: audio || undefined },
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    if (image) {
      setStatusMessage("Kisan Doctor is scanning leaf...");
    } else {
      setStatusMessage("Kisan Doctor is thinking...");
    }

    try {
      const response = await sendChatMessage(newMessages, image, audio, text, language || 'English');

      const botMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: { text: response.text_response, botResponse: response },
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, botMsg];
      setMessages(finalMessages);
      
      if (user) {
        saveUserHistory(user.id, finalMessages);
      }

      if (response.type === 'DIAGNOSIS' && response.diagnosis_data) {
        const report: FarmerReport = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          crop: response.diagnosis_data.crop_detected,
          symptoms: text || "Image Scan",
          diagnosis: response.diagnosis_data,
          imageUri: image || undefined
        };
        
        if (user) {
          saveReport(user.id, report);
        }
        
        setTimeout(() => {
          setActiveReport(report);
          setView(AppView.REPORT);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateWithLanguage = (v: AppView) => {
    if (!language) {
      setTargetView(v);
      setView('LANGUAGE_SELECT');
    } else {
      setView(v);
    }
  };

  const handleStart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      navigateWithLanguage(AppView.CHAT);
    }
  };

  const onLanguageSelected = (l: string) => {
    setLanguage(l);
    localStorage.setItem(APP_LANG_KEY, l);
    if (targetView) {
      setView(targetView);
      setTargetView(null);
    } else {
      setView(AppView.CHAT);
    }
  };

  const handleDeleteSpecificChat = async (chatId: string) => {
    if (!user) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this chat message?');
    if (!confirmDelete) return;

    try {
      const success = await deleteSpecificChat(user.id, chatId);
      if (success) {
        const updatedMessages = messages.filter(msg => msg.id !== chatId);
        setMessages(updatedMessages);
        // Save the updated history
        if (user) {
          await saveUserHistory(user.id, updatedMessages);
        }
        console.log('Chat deleted successfully, remaining messages:', updatedMessages.length);
      } else {
        alert('Failed to delete chat message. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('An error occurred while deleting the chat message.');
    }
  };

  const handleDeleteAllChats = async () => {
    if (!user) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete ALL chat messages? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const success = await deleteAllChats(user.id);
      if (success) {
        setMessages([]);
        // Save empty history
        if (user) {
          await saveUserHistory(user.id, []);
        }
        console.log('All chats deleted successfully');
      } else {
        alert('Failed to delete all chats. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting all chats:', error);
      alert('An error occurred while deleting all chats.');
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedMessages(new Set());
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleDeleteSelectedMessages = async () => {
    if (!user || selectedMessages.size === 0) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedMessages.size} selected message(s)?`);
    if (!confirmDelete) return;

    try {
      const success = await deleteSelectedMessages(Array.from(selectedMessages));
      if (success) {
        const updatedMessages = messages.filter(msg => !selectedMessages.has(msg.id));
        setMessages(updatedMessages);
        setSelectedMessages(new Set());
        setIsSelectionMode(false);
        // Save the updated history
        if (user) {
          await saveUserHistory(user.id, updatedMessages);
        }
        console.log('Selected messages deleted successfully');
      } else {
        alert('Failed to delete selected messages. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting selected messages:', error);
      alert('An error occurred while deleting selected messages.');
    }
  };

  const renderViewContent = () => {
    if (view === 'LANDING') return (
      <LandingPage 
        onStart={handleStart} 
        onMenuClick={() => setIsSidebarOpen(true)} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        user={user} 
      />
    );
    
    if (view === 'LANGUAGE_SELECT') return (
      <LanguageSelector onSelect={onLanguageSelected} />
    );

    return (
      <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} onLogoClick={() => setView('LANDING')} />
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:px-8 max-w-4xl mx-auto w-full no-scrollbar">
            {view === AppView.CHAT && (
              <div className="space-y-6 pb-24">
                {messages.length === 0 && (
                  <div className="text-center py-20 animate-fade-in">
                    <div className="bg-emerald-600 w-24 h-24 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
                       <div className="absolute inset-0 bg-white opacity-10 rounded-[3rem]"></div>
                       <Smile className="text-white" size={48} />
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
                      Namaste, {user?.name || 'Farmer'}!
                    </h3>
                    <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm leading-relaxed mb-8">
                      I am your Kisan Plant Doctor ({language}). Send me a photo of your plant or just type your question to get started.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                       <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                          <Sprout size={16} className="text-emerald-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Expert Care for Your Crops</span>
                       </div>
                    </div>
                  </div>
                )}
                {messages.map(msg => (
                  <ChatMessage 
                    key={`${msg.id}-${msg.timestamp.getTime()}`} 
                    message={msg} 
                    onViewReport={(d, img) => { setActiveReport({ id: 'v-'+Date.now(), timestamp: new Date().toISOString(), crop: d.crop_detected, symptoms: 'Manual View', diagnosis: d, imageUri: img }); setView(AppView.REPORT); }}
                    onLocationSubmit={(loc) => handleSend(`My location is ${loc}. Please list local centers.`, null, null)}
                    onDeleteChat={handleDeleteSpecificChat}
                    isSelectable={isSelectionMode}
                    isSelected={selectedMessages.has(msg.id)}
                    onToggleSelect={toggleMessageSelection}
                    selectedLanguage={language || 'English'}
                  />
                ))}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="w-12 h-12 mr-3 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                      <Avatar isTyping={true} size="small" />
                    </div>
                    <div className="bg-[#064e3b] rounded-[2rem] rounded-tl-none px-6 py-4 shadow-xl border border-white/10 flex items-center gap-4">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">{statusMessage}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            {view === AppView.REPORT && activeReport && <ReportCard report={activeReport} onBack={() => setView(AppView.CHAT)} />}
            {view === AppView.HISTORY && user && <HistoryView userId={user.id} userName={user.name} onBack={() => setView(AppView.CHAT)} onSelectReport={r => { setActiveReport(r); setView(AppView.REPORT); }} />}
            {view === AppView.WEATHER && <WeatherView onBack={() => setView(AppView.CHAT)} language={language || 'English'} />}
            {view === AppView.ADMIN && <AdminUserList onBack={() => setView(AppView.CHAT)} />}
            {view === AppView.DOCS && <DocsView onBack={() => setView(AppView.CHAT)} />}
            {view === AppView.LEARNING_CENTER && <LearningCenter onBack={() => setView(AppView.CHAT)} />}
            {view === AppView.CROP_LIBRARY && <CropLibrary onBack={() => setView(AppView.CHAT)} />}
            {view === AppView.VOICE_SETTINGS && <VoiceSettings onBack={() => setView(AppView.CHAT)} />}
          </div>
          {view === AppView.CHAT && (
            <div className="sticky bottom-0 z-30 px-4 pb-4">
              <div className="max-w-4xl mx-auto w-full">
                {isSelectionMode ? (
                  <div className="mb-2 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-800">
                        {selectedMessages.size} message{selectedMessages.size !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleSelectionMode}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteSelectedMessages}
                        disabled={selectedMessages.size === 0}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Delete Selected
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.length > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={toggleSelectionMode}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-md"
                        title="Select multiple messages to delete"
                      >
                        <Check size={14} />
                        Select
                      </button>
                      <button
                        onClick={handleDeleteAllChats}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-md"
                        title="Delete all chat messages"
                      >
                        <Trash2 size={14} />
                        Clear All
                      </button>
                    </div>
                  )
                )}
                {!isSelectionMode && (
                  <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
                    <ChatInput onSend={handleSend} isLoading={isLoading} selectedLanguage={language || 'English'} />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  return (
    <div className="antialiased text-slate-900 bg-[#FDFBF7] min-h-screen">
      {renderViewContent()}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onCheckCrop={() => navigateWithLanguage(AppView.CHAT)} 
        onFindExperts={() => { navigateWithLanguage(AppView.CHAT); handleSend("I need local help from agricultural experts.", null, null); }} 
        onReset={() => { setMessages([]); setView('LANDING'); }} 
        onChangeLanguage={() => setView('LANGUAGE_SELECT')} 
        onShowHistory={() => navigateWithLanguage(AppView.HISTORY)} 
        onShowWeather={() => navigateWithLanguage(AppView.WEATHER)} 
        onShowAdmin={() => navigateWithLanguage(AppView.ADMIN)}
        onShowDocs={() => navigateWithLanguage(AppView.DOCS)}
        onShowLearningCenter={() => navigateWithLanguage(AppView.LEARNING_CENTER)}
        onShowCropLibrary={() => navigateWithLanguage(AppView.CROP_LIBRARY)}
        onShowVoiceSettings={() => navigateWithLanguage(AppView.VOICE_SETTINGS)}
        user={user}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogoutClick={() => { setUser(null); setMessages([]); setView('LANDING'); }}
      />
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLoginSuccess={(u) => {
            setUser(u);
            setIsAuthModalOpen(false);
            if (!language) {
              setView('LANGUAGE_SELECT');
            } else {
              setView(AppView.CHAT);
            }
          }} 
        />
      )}
    </div>
  );
};

export default App;
