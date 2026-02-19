import { cn } from "../../lib/utils";

export const Badge = ({ children, variant = "purple" }: { children: React.ReactNode; variant?: string }) => {
  const colors: any = {
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    green: "border-green-500/30 bg-green-500/10 text-green-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", colors[variant])}>
      {children}
    </span>
  );
};