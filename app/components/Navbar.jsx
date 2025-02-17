

// components/Navbar.js
"use client";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";


export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <nav className={`p-4 flex justify-between items-center ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold">Codemaper
      
      </h1>
    
      <ul className="flex justify-center space-x-10 list-none hover:color-green ">
        <li><a href="#section1">Home</a></li>
        <li><a href="#section2">Playground</a></li>
        <li><a href="#section3">Seniors</a></li>
        <li><a href="#section4">AI Review</a></li>
        <li><a href="#section5">Journey</a></li>
      </ul>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
