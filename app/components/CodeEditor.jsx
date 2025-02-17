// components/CodeEditor.js

import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";


export default function CodeEditor({ setOutput }) {
  const [code, setCode] = useState("// Write your code here");

  const handleRun = () => {
    try {
      // Evaluating the JS code using Function constructor (for security, use with caution)
      const result = new Function(code)();
      setOutput(result);
    } catch (error) {
      setOutput(error.toString());
    }
  };

  return (
    <div className="code-editor-container">
      <MonacoEditor
        height="400px"
        language="javascript"
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
      />
      <button onClick={handleRun} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Run Code
      </button>
    </div>
  );
}
