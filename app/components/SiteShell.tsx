"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Scanlines from './Scanlines';
import { useWebContainer } from '../hooks/usewebContainer';

function WebContainerPreboot() {
  useWebContainer();
  return null;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = pathname.startsWith('/project/') || pathname.startsWith('/dashboard');

  if (isFullScreen) return <><WebContainerPreboot />{children}</>;

  return (
    <>
      <Scanlines />
      <Navbar />
      <main className="relative z-10 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
