# 🩺 DiagnosAI — AI Healthcare Diagnostic Tool

DiagnosAI is an intelligent, user-friendly web application designed to assist users in identifying potential health conditions based on symptoms. By combining guided surveys with AI-driven analysis, the platform provides quick, accessible, and informative health insights.

 **Disclaimer:** DiagnosAI is not a replacement for professional medical advice, diagnosis, or treatment.

##  Features

- **Interactive Symptom Survey:** Guided questionnaire to collect user symptoms in a structured way.
- **AI-Powered Analysis:** Processes user input to generate possible conditions and insights.
- **Real-Time Results Screen:** Displays potential diagnoses with a clean, understandable UI.
- **Modern UI/UX:** Built with a responsive, visually appealing interface using Tailwind and component libraries.
- **Loading & Transition States:** Smooth transitions between survey, processing, and results.

## Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **State/Data Handling:** React Query
- **Backend/Database:** Supabase
- **Animations:** Framer Motion
- **Validation:** Zod + React Hook Form

##  Project Structure

```
src/
├── components/
│   ├── IntroScreen.tsx       # Landing / intro UI
│   ├── SurveyScreen.tsx      # Symptom input flow
│   ├── LoadingScreen.tsx     # Processing state
│   ├── ResultsScreen.tsx     # Diagnosis output
│   └── ui/                   # Library components
├── App.tsx
└── main.tsx
```


##  How It Works

1. User enters symptoms through a guided survey
2. Data is processed (locally or via backend/AI logic)
3. The system evaluates possible conditions
4. Results are displayed with relevant insights

## 🌱 Future Improvements

- Integration with real medical datasets
- More advanced AI diagnostic models
- User accounts & history tracking
- Wearable / sensor integration
- Doctor-facing dashboard

##  Contributors

Program:
Mohammad A.
Ahmad F.

Pitch and Presentation:
Amaira B.
Po Po T.
