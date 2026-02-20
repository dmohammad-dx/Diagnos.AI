import { AnimatePresence } from "framer-motion";
import { useDiagnosticFlow } from "@/hooks/useDiagnosticFlow";
import IntroScreen from "@/components/IntroScreen";
import SurveyScreen from "@/components/SurveyScreen";
import ResultsScreen from "@/components/ResultsScreen";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const {
    phase,
    questions,
    currentIndex,
    answers,
    results,
    error,
    submitSymptom,
    answerQuestion,
    restart,
  } = useDiagnosticFlow();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <IntroScreen key="intro" onSubmit={submitSymptom} error={error} />
        )}
        {phase === "loading" && (
          <LoadingScreen key="loading" message="Preparing your assessment..." />
        )}
        {phase === "survey" && questions[currentIndex] && (
          <SurveyScreen
            key="survey"
            question={questions[currentIndex]}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            onAnswer={answerQuestion}
          />
        )}
        {phase === "analyzing" && (
          <LoadingScreen key="analyzing" message="Analyzing your responses..." />
        )}
        {phase === "results" && results && (
          <ResultsScreen
            key="results"
            results={results}
            answers={answers}
            onRestart={restart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
