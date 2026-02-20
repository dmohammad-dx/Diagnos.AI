import { useState } from "react";
import { AppPhase, SurveyQuestion, SurveyAnswer, DiagnosisResult } from "@/types/diagnosis";
import { supabase } from "@/integrations/supabase/client";

export function useDiagnosticFlow() {
  const [phase, setPhase] = useState<AppPhase>("intro");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [results, setResults] = useState<DiagnosisResult | null>(null);
  const [initialSymptom, setInitialSymptom] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitSymptom = async (symptom: string) => {
    setInitialSymptom(symptom);
    setPhase("loading");
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("diagnose-survey", {
        body: { symptom },
      });
      if (fnError) throw fnError;
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers([]);
      setPhase("survey");
    } catch (e: any) {
      console.error("Error generating survey:", e);
      setError("Something went wrong generating the survey. Please try again.");
      setPhase("intro");
    }
  };

  const answerQuestion = async (answer: string) => {
    const current = questions[currentIndex];
    const newAnswers = [...answers, { question: current.question, answer }];
    setAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All questions answered, get diagnosis
      setPhase("analyzing");
      try {
        const { data, error: fnError } = await supabase.functions.invoke("diagnose-results", {
          body: { symptom: initialSymptom, answers: newAnswers },
        });
        if (fnError) throw fnError;
        setResults(data);
        setPhase("results");
      } catch (e: any) {
        console.error("Error getting results:", e);
        setError("Something went wrong analyzing your responses. Please try again.");
        setPhase("intro");
      }
    }
  };

  const restart = () => {
    setPhase("intro");
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setResults(null);
    setInitialSymptom("");
    setError(null);
  };

  return {
    phase,
    questions,
    currentIndex,
    answers,
    results,
    error,
    submitSymptom,
    answerQuestion,
    restart,
  };
}
