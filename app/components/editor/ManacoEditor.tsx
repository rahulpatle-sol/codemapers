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
          fontSize: 13,
          padding: { top: 16 },
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: true,
          foldingHighlight: false,
          scrollBeyondLastLine: false,
          renderWhitespace: "selection",
          renderLineHighlight: "line",
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderValidationDecorations: "off",
          matchBrackets: "never",
          occurrencesHighlight: "off",
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: "always",
          tabSize: 2,
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
        }}
      />
    </div>
  );
}
