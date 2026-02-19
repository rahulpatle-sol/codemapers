import { cn } from "../../lib/utils";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl",
    className
  )}>
    {children}
  </div>
);