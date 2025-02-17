// app/page.js


import { useState } from "react";
import CodeEditor from "./CodeEditor";
import Terminal from "./Terminal";

export default function Playground() {
  const [output, setOutput] = useState("");

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 min-h-screen">
      <h1 className="text-4xl text-white mb-8">Code Playground</h1>
      
      <CodeEditor setOutput={setOutput} />
      
      <div className="mt-8 w-full">
        <Terminal output={output} />
      </div>
    </div>
  );
}
