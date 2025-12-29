
# Project Title

A brief description of what this project does and who it's for

# 🚀 CV Boost | AI-Powered Resume Intelligence

**CV Boost** is a professional full-stack application designed to help job seekers optimize their resumes for modern Applicant Tracking Systems (ATS). By leveraging **React Router 7** and **Google Gemini AI**, the platform provides deep-dive analysis, keyword gap identification, and real-time scoring.

---

## 🏗️ Technical Stack

* **Frontend:** React 19, React Router 7 (Vite)
* **Styling:** Tailwind CSS v4 (Modern Utility Engine)
* **Backend & Auth:** Supabase (PostgreSQL + Auth)
* **AI Engine:** Google Gemini 1.5 Flash
* **State Management:** Zustand
* **PDF Processing:** PDF.js (Client-side rendering)

---

## 🌟 Key Features

* **AI Analysis:** Instant comparison between resume content and job descriptions using Google's Flash 1.5 model.
* **Visual Snapshot:** Converts PDF pages to high-quality `.webp` images for side-by-side review without heavy server load.
* **ATS Score:** Calculates match percentage based on skills, impact, and keywords.
* **Secure Dashboard:** Full CRUD operations for managing previous analysis history.
* **Cloud Storage:** Dual-bucket system for secure document and preview image storage.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/      # Reusable UI (Accordion, ScoreBadge, Summary)
│   ├── lib/             # Configurations (Supabase client, Auth-store)
│   ├── routes/          # Page views (Home, Upload, Results, Auth)
│   ├── services/        # Business logic (Gemini API, PDF processing)
│   ├── root.tsx         # Main Layout & Hydration config
│   └── routes.ts        # React Router 7 route definitions
├── public/              # Icons and static assets
└── app.css              # Tailwind 4 configuration & global styles
```

---

## 🛠️ Installation & Setup
### 1. Clone the Project

```Bash
git clone [https://github.com/your-username/ai-resume-analyzer.git](https://github.com/your-username/ai-resume-analyzer.git)
cd ai-resume-analyzer
```

### 2. Install Dependencies

```Bash

npm install
```

### 3. Configure Environment Variables
#### Create a .env file in the root:


``` env

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_google_ai_key
```

### 4. Run the App
```Bash

npm run dev
```

---

## 📐 Architecture Highlights
- Optimized Hydration: Uses React Router 7's <Scripts /> component for seamless SPA transitions.

- Edge-Ready Storage: Client-side PDF processing reduces server costs and ensures privacy.

- Database Security: Row Level Security (RLS) ensures that users can only access their own resumes.

- Performance: Implements useMemo and custom hooks for efficient data fetching and UI rendering.

---

## 🚀 Deployment (Vercel)
- Connect your GitHub repo to Vercel.

- Framework Preset: Other (Vite is automatically detected).

- Build Command: npm run build

- Output Directory: .react-router/client

- Add your Environment Variables in the Vercel Settings tab.

---

## 📝 License
- MIT License © 2025 [Dilshan]

---
## 📬 Contact
- GitHub: https://github.com/your-username

- Email: sdpdilshan99@gmail.com