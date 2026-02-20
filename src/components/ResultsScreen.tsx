import { motion } from "framer-motion";
import { DiagnosisResult, SurveyAnswer } from "@/types/diagnosis";
import { RotateCcw, AlertTriangle, Stethoscope, ClipboardList, UserCheck } from "lucide-react";

interface ResultsScreenProps {
  results: DiagnosisResult;
  answers: SurveyAnswer[];
  onRestart: () => void;
}

const ResultsScreen = ({ results, answers, onRestart }: ResultsScreenProps) => {
  const likelihoodColor = (l: string) => {
    if (l === "High") return "bg-destructive/10 text-destructive";
    if (l === "Moderate") return "bg-highlight text-highlight-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4 pb-16"
    >
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          Your Assessment Results
        </h1>
        <p className="text-muted-foreground text-sm">
          Based on your responses, here's what we found.
        </p>
      </div>

      {/* Conditions */}
      {results.conditions.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">Possible Conditions</h2>
          </div>
          <div className="grid gap-3">
            {results.conditions.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-card-foreground">{c.name}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${likelihoodColor(c.likelihood)}`}>
                    {c.likelihood} likelihood
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Procedures */}
      {results.procedures.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">Recommended Procedures</h2>
          </div>
          <div className="grid gap-3">
            {results.procedures.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <h3 className="font-semibold text-card-foreground mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                <div className="text-xs space-y-1">
                  <p><span className="font-medium text-surface-foreground">Who needs it:</span> <span className="text-muted-foreground">{p.whoNeedsIt}</span></p>
                  <p><span className="font-medium text-surface-foreground">Alignment with your case:</span> <span className="text-muted-foreground">{p.alignment}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Specialists */}
      {results.specialists.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">Specialists to Consider</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.specialists.map((s, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Summary of answers */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold text-foreground">Your Responses</h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          {answers.map((a, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium text-card-foreground">{a.question}</p>
              <p className="text-muted-foreground">{a.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          <RotateCcw className="h-4 w-4" />
          Start New Assessment
        </button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center max-w-md mx-auto">
        This assessment is for informational purposes only. Please consult a healthcare professional for proper diagnosis and treatment.
      </p>
    </motion.div>
  );
};

export default ResultsScreen;
