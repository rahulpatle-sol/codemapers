import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "./components/SiteShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CodeMapers | The AI-Orchestrated Cloud IDE",
    template: "%s | CodeMapers"
  },
  description: "Next-generation cloud IDE with neural orchestration. Build and deploy at the speed of thought with zero local setup.",
  metadataBase: new URL('https://codemapers.com'),
  keywords: ["Cloud IDE", "AI Code Editor", "Online Compiler", "Neural Coding", "CodeMapers"],
  authors: [{ name: "Rahul Patle" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codemapers.rahulpatle.xyz",
    title: "CodeMapers | Build the Future in Your Browser",
    description: "Experience the first context-aware IDE that lives in the cloud.",
    siteName: "CodeMapers",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CodeMapers Preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeMapers | AI Cloud IDE",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${spaceMono.variable} 
          antialiased bg-[#f4f1ea] selection:bg-amber-500 selection:text-black overflow-x-hidden
        `}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
