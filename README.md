# 🩺 DiagnosAI — AI Healthcare Diagnostic Tool

DiagnosAI is an intelligent, user-friendly web application designed to assist users in identifying potential health conditions based on symptoms. By combining guided surveys with AI-driven analysis, the platform provides quick, accessible, and informative health insights.

⚠️ **Disclaimer:** DiagnosAI is not a replacement for professional medical advice, diagnosis, or treatment.

## 🚀 Features

- **Interactive Symptom Survey** — Guided questionnaire to collect user symptoms in a structured way.
- **AI-Powered Analysis** — Processes user input to generate possible conditions and insights.
- **Real-Time Results Screen** — Displays potential diagnoses with a clean, understandable UI.
- **Modern UI/UX** — Built with a responsive, visually appealing interface using Tailwind and component libraries.
- **Loading & Transition States** — Smooth transitions between survey, processing, and results.

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **State/Data Handling:** React Query
- **Backend/Database:** Supabase
- **Animations:** Framer Motion
- **Validation:** Zod + React Hook Form

## 📁 Project Structure

```
src/
├── components/
│   ├── IntroScreen.tsx       # Landing / intro UI
│   ├── SurveyScreen.tsx      # Symptom input flow
│   ├── LoadingScreen.tsx     # Processing state
│   ├── ResultsScreen.tsx     # Diagnosis output
│   └── ui/                   # Reusable UI components
├── App.tsx
└── main.tsx
```

## ⚙️ Installation & Setup

### Clone the repository

```bash
git clone <your-repo-url>
cd diagnosaiWeb
```

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file and configure your Supabase credentials:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Run the development server

```bash
npm run dev
```

Open in browser: `http://localhost:5173`

## 🧠 How It Works

1. User enters symptoms through a guided survey
2. Data is processed (locally or via backend/AI logic)
3. The system evaluates possible conditions
4. Results are displayed with relevant insights

## 🧪 Testing

Run tests using:

```bash
npm run test
```

## 📦 Build

To create a production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

## 🔒 Disclaimer

- DiagnosAI is intended for educational and informational purposes only.
- It does not provide medical advice and should not be used as a substitute for consultation with a qualified healthcare professional.

## 🌱 Future Improvements

- Integration with real medical datasets
- More advanced AI diagnostic models
- User accounts & history tracking
- Wearable / sensor integration
- Doctor-facing dashboard

## 👥 Contributors

Your Team Name / Members
