import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface IntroScreenProps {
  onSubmit: (symptom: string) => void;
  error: string | null;
}

const IntroScreen = ({ onSubmit, error }: IntroScreenProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onSubmit(input.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full max-w-2xl mx-auto px-4"
    >
      <div className="mb-2 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xl font-display font-bold">+</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
          Diagnos is here to help...
        </h1>
      </div>

      <p className="text-muted-foreground text-center text-base sm:text-lg mt-4 mb-8 max-w-lg leading-relaxed">
        Just take your time to describe how you're feeling right now, 
        and we'll get you the advice you need.
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I've had a sharp pain in my right knee for the past week, especially when walking upstairs..."
            rows={4}
            className="w-full rounded-2xl border border-border bg-card text-card-foreground px-5 py-4 pr-14 text-base resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-3 bottom-3 h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {[
          "My vision is blurry",
          "My teeth hurt",
          "I have a headache",
          "My back is sore",
          "I feel short of breath",
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSubmit(suggestion)}
            className="px-4 py-2 rounded-full border border-border bg-card text-muted-foreground text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-destructive text-sm text-center">{error}</p>
      )}

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-md">
        This tool is for informational purposes only and does not constitute medical advice.
        Always consult a licensed healthcare professional.
      </p>
    </motion.div>
  );
};

export default IntroScreen;
