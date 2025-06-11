import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
//  Import getServerSession and authOptions
import { getServerSession } from "next-auth";
// import { authOptions } from 'app/api/auth/[...nextauth]/route'; 
import { authOptions } from "app/lib/auth"; // Adjust the import path as necessary

import Provider from 'app/client-provider'; 
import Navbar from "./components/Navbar";
import FooterSection from "./components/Footer";
export const metadata: Metadata = {
  title: "Codemapers - Cloud IDE & PC Rental",
  description: "Codemapers provides a powerful cloud-based IDE for coding and seamless PC rental services.",
  keywords: ["cloud IDE", "online coding platform", "PC rental service", "remote development", "coding workspace", "virtual machines", "programming tools"],
  authors: [{ name: "Codemapers Team", url: "https://codemapers.vercel.app" }],
  icons: {
    icon: "./favicon.ico",
  },
  openGraph: {
    title: "Codemapers - Cloud IDE & PC Rental",
    description: "Access a high-performance cloud IDE and rent powerful PCs for development anytime, anywhere.",
    url: "https://codemapers.com",
    siteName: "Codemapers",
    type: "website",
    
  },
  twitter: {
    card: "summary_large_image",
    site: "@codemapers",
    title: "Codemapers - Cloud IDE & PC Rental",
    description: "Cloud-based coding IDE and PC rental for remote developers.",
 
  },
};




export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
  <link rel="icon" href="/favicon.ico" sizes="any" />
</head>

      <body className="m-4">
        <Provider session={session}>
          <Navbar />
          <div className="min-h-screen py-10">
            {children}
          </div>
          <FooterSection />
        </Provider>
      </body>
    </html>
  );
}


