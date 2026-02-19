export const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => (
  <div className="group relative flex items-center">
    {children}
    <div className="absolute left-full ml-3 px-2 py-1 bg-[#1a1a1a] border border-white/10 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none z-50 shadow-xl whitespace-nowrap">
      {text}
      <div className="absolute top-1/2 left-[-4px] -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-[#1a1a1a]" />
    </div>
  </div>
);