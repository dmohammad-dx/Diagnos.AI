export interface SurveyQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface SurveyAnswer {
  question: string;
  answer: string;
}

export interface DiagnosisResult {
  conditions: {
    name: string;
    likelihood: "High" | "Moderate" | "Low";
    description: string;
  }[];
  procedures: {
    name: string;
    description: string;
    alignment: string;
    whoNeedsIt: string;
  }[];
  specialists: string[];
}

export type AppPhase = "intro" | "loading" | "survey" | "analyzing" | "results";
