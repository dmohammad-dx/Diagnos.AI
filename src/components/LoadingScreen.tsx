import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      <p className="text-muted-foreground text-base font-medium">{message}</p>
    </motion.div>
  );
};

export default LoadingScreen;
