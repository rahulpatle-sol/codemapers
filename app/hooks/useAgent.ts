"use client";
import { useState } from 'react';
import { printProjectReport } from '@/lib/agent/printer'; // Jo humne printer utility banayi

export function useAgent(projectId: string) {
  const [isWorking, setIsWorking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentDocs, setCurrentDocs] = useState<{prd: string, srs: string, logs: string} | null>(null);

  const startAutomatedTask = async (taskDescription: string, terminalErrors?: string) => {
    setIsWorking(true);
    setLogs(prev => [...prev, "🚀 Agent starting the Lab execution..."]);

    try {
      // 1. Send task to Autonomous API
      const res = await fetch('/api/automate', {
        method: 'POST',
        body: JSON.stringify({ 
          task: taskDescription, 
          projectId,
          errors: terminalErrors // Agar errors hain to AI unhe fix karega
        })
      });
      
      const data = await res.json();
      const plan = data.plan;

      // 2. Update logs based on AI plan
      setLogs(prev => [...prev, 
        "✅ Logic Architected.", 
        "📝 PRD & SRS Generated.", 
        "🛠️ Security Audit Complete."
      ]);

      // Docs state me save karo taaki print ho sake
      setCurrentDocs(plan.docs);

      // 3. Build Completion Notification
      await fetch('/api/notify', {
        method: 'POST',
        body: JSON.stringify({ 
          title: "Lab Task Complete!", 
          message: "Bhai, tera code aur report ready hai. Chill karo!", 
          userId: "user_1" 
        })
      });

    } catch (err) {
      setLogs(prev => [...prev, "❌ Error: Agent encountered a gravity leak!"]);
    } finally {
      setIsWorking(false);
    }
  };

  // 4. Manual Print Function for the User
  const handlePrintReport = async () => {
    if (!currentDocs) {
      alert("Bhai, pehle agent ko kaam karne do!");
      return;
    }
    setLogs(prev => [...prev, "🖨️ Printing Final PDF Report..."]);
    await printProjectReport("Antigravity_Project", currentDocs);
  };

  return { 
    startAutomatedTask, 
    handlePrintReport, 
    isWorking, 
    logs,
    hasDocs: !!currentDocs 
  };
}