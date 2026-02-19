"use client";
import Editor from "@monaco-editor/react";

interface Props {
  code: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

export default function MonacoEditor({ code, onChange, language = "typescript" }: Props) {
  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 20 },
          fontFamily: "'Fira Code', monospace",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          lineNumbers: "on",
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden'
          }
        }}
      />
    </div>
  );
}