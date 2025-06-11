"use client";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import TerminalUI from "./Terminal"; // Make sure this exists
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { defaultCode, fileExtensions } from "./constants"; 

import ChatBox from "../components/ChatBox";
import Link from "next/link";
import { Files } from "lucide-react";

// [same defaultCode and fileExtensions objects as before]

export default function CloudIDE() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCode["javascript"]);
  const [output, setOutput] = useState("");
  const [filename, setFilename] = useState("main");
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<Record<string, any[]>>({});
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const { data: session } = useSession();
  if (!session) redirect("/login");

  const runCode = async () => {
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    const data = await res.json();
    console.log("Execution Response:", data); // Debugging API response  
    setOutput(data.output || "No output");
  };
  

  const saveFile = async () => {
    await fetch("/api/files/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, content: code, language }),
    });
    fetchFiles();
    
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files/get");
      const data = await res.json(); // ✅ Correctly defining 'data'
      
      console.log("Fetched Files:", data.files); // Debugging
      
      // Check if data.files exists before processing
      if (!data.files || !Array.isArray(data.files)) {
        console.error("No files found!");
        setFiles([]);
        return;
      }
  
      // Organize files into folders
      const groupedFiles = data.files.reduce((acc: any, file: any) => {
        const folder = file.path ? file.path.split("/")[0] : "Unsorted"; 
        acc[folder] = acc[folder] || [];
        acc[folder].push(file);
        return acc;
      }, {});
  
      setFolders(groupedFiles);
      setFiles(data.files);
    } catch (err) {
      console.error("Failed to fetch files:", err);
      setFiles([]);
    }
  };
  

  
  

  useEffect(() => {
    fetchFiles();
  }, []);
  
  useEffect(() => {
    // console.log("Terminal Component Mounted!");
  }, []);
  

  const handleResize = (e: React.MouseEvent) => {
    document.addEventListener("mousemove", resizeSidebar);
    document.addEventListener("mouseup", stopResizing);
  };
  
  const resizeSidebar = (e: any) => setSidebarWidth(e.clientX);
  const stopResizing = () => {
    document.removeEventListener("mousemove", resizeSidebar);
    document.removeEventListener("mouseup", stopResizing);
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-white font-mono flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-cyan-700">
        <h1 className="text-xl font-bold text-cyan-400">
          ⚡ {session?.user?.name || "User"}'s Workspace
        </h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-400 hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className="bg-[#1a1d23] p-4 border-r border-cyan-700 relative"
          style={{ width: sidebarWidth }}
        >
          <h2 className="text-xl font-bold mb-4 text-cyan-400">📁 Files</h2>
          {Object.keys(folders).length ? (
            Object.keys(folders).map((folder) => (
              <div key={folder}>
                <h3 className="text-cyan-500 font-bold">📂 {folder}</h3>
                <ul className="space-y-2">
  {files.length > 0 ? (
    files.map((file) => (
      <li
        key={file._id}
        onClick={() => {
          setCode(file.content);
          setFilename(`${file.filename}.${fileExtensions[file.language]}`);
          setLanguage(file.language);
        }}
        className="cursor-pointer hover:text-cyan-400 text-sm"
      >
        📄 {file.filename}.{fileExtensions[file.language] || file.language}
      </li>
    ))
  ) : (
    <li className="text-gray-400 text-sm">No files found.</li>
  )}
</ul>


              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No files found.</p>
          )}
          <div
            className="absolute top-0 right-0 h-full w-2 bg-cyan-500 cursor-ew-resize"
            onMouseDown={handleResize}
          />
        </div>

        {/* Editor + Terminal area */}
        <div className="flex-1 flex flex-col p-4 gap-2">
          <div className="flex gap-4 mb-2">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="bg-[#1a1d23] text-white p-2 rounded w-full border border-cyan-500"
              placeholder="Filename"
            />
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setCode(defaultCode[e.target.value]);
              }}
              className="bg-[#1a1d23] text-white border border-cyan-500 rounded p-2"
            >
              {Object.keys(fileExtensions).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()} ({fileExtensions[lang]})
                </option>
              ))}
            </select>
          </div>

          {/* Editor */}
          <Editor
            height="400px"
            theme="vs-dark"
            defaultLanguage={language}
            value={code}
            onChange={(value) => setCode(value || "")}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={runCode}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded"
            >
              ▶️ Run
            </button>
            <button
              onClick={saveFile}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded"
            >
              💾 Save
            </button>
            <div className="mt-6 bg-[#1a1d23] rounded p-4 shadow-inner overflow-auto">
 
</div>


          </div>
           <h2 className="text-lg mb-2 text-green-400 font-semibold">📦 Output:</h2>
  <pre className="text-green-300 whitespace-pre-wrap text-sm">{output}</pre>

          {/* Terminal at Bottom */}
          <div className="mt-4 bg-indigo-300border border-cyan-600 rounded h-[200px] overflow-hidden">
  <TerminalUI />
</div>

        </div>
      </div>

      {/* Chatbox (optional bottom or right) */}
      <ChatBox />
    </div>
  );
}
