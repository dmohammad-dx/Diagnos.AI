import { motion, AnimatePresence } from "framer-motion";
import { SurveyQuestion } from "@/types/diagnosis";

interface SurveyScreenProps {
  question: SurveyQuestion;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
}

const SurveyScreen = ({ question, questionIndex, totalQuestions, onAnswer }: SurveyScreenProps) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4">
      {/* Progress */}
      <div className="w-full mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Question {questionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(((questionIndex + 1) / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground text-center mb-8">
            {question.question}
          </h2>

          <div className="grid gap-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => onAnswer(option)}
                className="w-full text-left px-5 py-4 rounded-xl border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground hover:border-primary/30 transition-all duration-200 text-base"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SurveyScreen;
