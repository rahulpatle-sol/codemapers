"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  // About aur IDE pages dark ho sakte hain, baaki off-white newspaper theme
  const isDark = pathname === '/about' || pathname.startsWith('/editor'); 

  const navLinks = [
    { name: 'Story', href: '/about' },
    { name: 'Lease', href: '/pricing' },
    { name: 'Features', href: '/features' },
    { name: 'Manual', href: '/docs' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] px-8 py-4 flex justify-between items-center transition-all duration-500 ${
      isDark 
        ? 'text-amber-500 bg-black/80' 
        : 'text-black bg-[#f4f1ea]/90 border-b-4 border-black'
    } backdrop-blur-md font-mono`}>
      
      {/* Logo with Terminal Icon */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className={`p-1.5 rounded-sm transition-colors ${isDark ? 'bg-amber-500 text-black' : 'bg-black text-[#f4f1ea]'}`}>
          <Terminal size={20} strokeWidth={3} />
        </div>
        <span className="text-2xl font-black italic tracking-tighter uppercase">
          CodeMapers
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest">
        {navLinks.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`transition-all hover:opacity-100 ${
              pathname === link.href 
                ? 'underline decoration-2 underline-offset-4 opacity-100' 
                : 'opacity-60 hover:underline hover:underline-offset-4'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Right Side Status (Optional but looks cool) */}
      <div className="hidden md:flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-amber-500' : 'bg-emerald-600'}`} />
        <span className="text-[9px] font-bold opacity-50 uppercase tracking-tighter">System_Live</span>
      </div>
    </nav>
  );
}