---

# 🌱 AgroCare – AI Based Smart Farming Application

![AI](https://img.shields.io/badge/AI-Powered-green)
![Status](https://img.shields.io/badge/Project-Active-success)
![Platform](https://img.shields.io/badge/Platform-Web%20%2F%20Mobile-blue)
![Language](https://img.shields.io/badge/Language-Multilingual-orange)
![License](https://img.shields.io/badge/License-Educational-lightgrey)

---

## 📖 Overview

**AgroCare** is an **AI-driven and multilingual smart farming platform** designed to assist farmers by providing technological support and expert guidance.

The system aims to **bridge the gap between traditional farming and modern digital solutions**, making agriculture more **efficient, informed, and secure**.

Farmers can upload crop images, detect plant diseases, consult nearby experts, and track past agricultural issues using the platform.

---

## 🎨 Design & User Interface Features

### 🌿 AI Crop Disease Detection

Farmers can **upload images of crops or plants**.
The system analyzes the image using **Artificial Intelligence** to detect:

* Crop diseases
* Pest attacks
* Plant health problems

### 👨‍🌾 Expert Guidance

Users can **find nearby farmer experts** and connect with professionals for:

* Farming advice
* Problem diagnosis
* Practical agricultural solutions

### 🕘 Search History

The platform stores **previous queries, uploaded images, and recommendations**, allowing farmers to revisit earlier problems and solutions.

### 🌍 Multilingual Support

AgroCare supports **multiple languages**, making the system easy to use for farmers from different regions.

### 🔐 Secure Login System

The application includes **secure authentication**, ensuring that only authorized users can access their accounts and stored information.

### 🤖 AI Avatar Interaction
- Animated **AI avatar** appears while AgroCare responds.
- **Bouncing dots animation** shows that the AI is processing the request.
- Makes the experience feel like a real assistant.

### 🚨 Disease Risk Badges
When a plant disease is detected, AgroCare displays clear visual badges:
- **HIGH RISK** – Immediate attention required.
- **GEMINI_VISION** – Detected using AI image analysis.
- **ORGANIC SAFE** – Organic treatment available.

### 🌱 Nutrient Deficiency Alerts
- Displays **amber warning boxes** when crops show nutrient deficiencies.
- Provides quick recommendations for fertilizers or organic solutions.

### ☑️ Smart Delete Mode
- Users can enable **delete mode** to manage saved reports.
- **Selection checkboxes** appear to allow multiple items to be deleted at once.

### 📚 Learning Center
- Educational farming content is organized in an **expandable format**.
- Farmers can click to expand topics such as:
  - Crop diseases
  - Organic treatments
  - Pest management
  - Fertilizer guidance

### 🌾 Crop Library
- A detailed **Crop Library** provides information for each crop:
  - Ideal growing conditions
  - Common diseases
  - Nutrient requirements
  - Organic treatment methods

### 🎯 Farmer-Friendly Design
- Simple layout
- Large readable text
- Clear icons and visual alerts
- Optimized for easy understanding

---


## 🧠 How AgroCare Works

1️⃣ Farmer registers and logs into the platform
2️⃣ Uploads an image of a crop or plant
3️⃣ AI analyzes the image
4️⃣ System detects possible diseases or issues
5️⃣ Farmer receives recommendations or connects with experts

---
## 📁 Project Directory Structure
| File                   | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `AdminUserList.tsx`    | Displays list of users for admin management    |
| `AuthModal.tsx`        | Login and signup modal for user authentication |
| `Avatar.tsx`           | Shows user profile avatar                      |
| `ChatInput.tsx`        | Input field where farmers type questions       |
| `ChatMessages.tsx`     | Displays chat conversation between user and AI |
| `CropLibrary.tsx`      | Shows crop information and farming details     |
| `DiagnosisResult.tsx`  | Displays plant disease diagnosis results       |
| `DocsView.tsx`         | Shows documentation and farming guides         |
| `ExpertFinder.tsx`     | Helps farmers find agriculture experts         |
| `Header.tsx`           | Top navigation bar of the application          |
| `HistoryView.tsx`      | Displays previous diagnoses and chat history   |
| `InputSection.tsx`     | Handles image upload and user query input      |
| `LandingPage.tsx`      | Main landing page of the application           |
| `LanguageSelector.tsx` | Allows users to change language                |
| `LearningCenter.tsx`   | Educational farming content and tutorials      |
| `ReportCard.tsx`       | Displays detailed crop health report           |
| `Sidebar.tsx`          | Sidebar navigation menu                        |
| `VoiceSettings.tsx`    | Settings for voice assistant                   |
| `WeatherView.tsx`      | Displays weather information for farmers       |

## ⚙️ Services Folder

| File                   | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `cnnService.ts`        | Handles plant disease detection using CNN model     |
| `dbService.ts`         | Manages database operations like saving history     |
| `geminiService.ts`     | Communicates with AI API to generate farming advice |
| `smartLocalService.ts` | Provides offline/local farming recommendations      |

## 💻 src Folder
 | File                      | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `.env`                    | Stores environment variables such as API keys   |
| `App.tsx`                 | Root React component controlling the app layout |
| `constants.ts`            | Contains global constant values                 |
| `dbService.ts`            | Database helper functions                       |
| `index.css`               | Global CSS styling for the application          |
| `index.html`              | Main HTML template                              |
| `index.tsx`               | Entry point that renders the React app          |
| `kisan_plant_doctor.html` | Additional HTML file                            |
| `metadata.json`           | Application metadata and configuration          |
| `package-lock.json`       | Locks exact dependency versions                 |
| `package.json`            | Defines project dependencies and scripts        |
| `README.md`               | Project documentation                           |
| `tsconfig.json`           | TypeScript configuration settings               |
| `types.ts`                | Defines TypeScript interfaces and types         |
| `updategts.ts`            | Utility helper functions                        |
| `vite-env.d.ts`           | Vite environment type definitions               |
| `vite.config.ts`          | Configuration file for Vite build tool          |

---
## 🧠 Workflow Explanation
| Step | Process                                                   |
| ---- | --------------------------------------------------------- |
| 1    | User opens the application landing page                   |
| 2    | User uploads plant image or asks farming question         |
| 3    | InputSection processes the user request                   |
| 4    | Image is sent to CNN service for disease detection        |
| 5    | AI service generates farming advice                       |
| 6    | Results are displayed in DiagnosisResult and ChatMessages |
| 7    | ReportCard shows detailed crop health report              |
| 8    | Data is saved using dbService                             |
| 9    | User can view history of diagnoses                        |

---
## 🧩 Architecture Flow
| Step | Component                       | Description                                                                                    |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1    | **User**                        | Farmer interacts with the system by uploading plant images or asking farming questions.        |
| 2    | **Frontend (React Components)** | The user interface built with React handles user input, image uploads, and displays responses. |
| 3    | **Service Layer**               | Processes requests from the frontend and communicates with AI services and database.           |
| 4    | **CNN Disease Detection**       | Analyzes uploaded plant images to identify possible plant diseases.                            |
| 5    | **Gemini AI Advice**            | Generates intelligent farming recommendations and solutions.                                   |
| 6    | **Database Service**            | Stores user queries, diagnosis results, and chat history.                                      |
| 7    | **Results Display**             | Displays diagnosis results, treatment suggestions, and AI responses to the user.               |
| 8    | **History Storage**             | Saves previous diagnoses and conversations so users can review them later.                     |

---
## 👥 Project Team
| Name                     | LinkedIn                                                               |
| ------------------------ | ---------------------------------------------------------------------- |
| **Samruddhi Kulkarni**   | 🔗 [LinkedIn](https://www.linkedin.com/in/samrudhi-kulkarni-b85991251) |
| **Renuka Chavan**        | 🔗 [LinkedIn](https://www.linkedin.com/in/renuka-chavan5102005)        |
| **Pramila Chandanshive** | 🔗 [LinkedIn](https://www.linkedin.com/in/pramila-c-ab3103256)         |
| **Gouri Babbe**          | 🔗 [LinkedIn](https://www.linkedin.com/in/gouri-babbe-8893942b5/)      |
| **Anjali Ambare**        | 🔗 [LinkedIn](https://www.linkedin.com/in/anjali-ambare-41b104301)     |

