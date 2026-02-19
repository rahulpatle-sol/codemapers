import { cn } from "../../lib/utils";
import { motion } from 'framer-motion';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const Button = ({ children, className, variant = "primary", ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20",
    secondary: "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300",
    ghost: "hover:bg-white/5 text-gray-400 hover:text-white border-none",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2", variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};