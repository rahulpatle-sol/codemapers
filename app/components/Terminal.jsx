// components/Terminal.js
export default function Terminal({ output }) {
    return (
      <div className="terminal-container">
        <h3 className="text-xl font-bold">Output:</h3>
        <pre className="text-white bg-black p-4 rounded">{output}</pre>
      </div>
    );
  }
  