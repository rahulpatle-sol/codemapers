"use client";
import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';

// Hook ke bahar variable rakho taaki ye tab session mein ek hi rahe
let webContainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export function useWebContainer() {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(webContainerInstance);
  const [isReady, setIsReady] = useState(!!webContainerInstance);

  useEffect(() => {
    async function boot() {
      // 1. Agar instance pehle se hai, toh seedha state set karo
      if (webContainerInstance) {
        setWebContainer(webContainerInstance);
        setIsReady(true);
        return;
      }

      // 2. Race condition handle karne ke liye (Double boot prevent karo)
      if (!bootPromise) {
        console.log("Starting WebContainer boot sequence... 🛡️");
        bootPromise = WebContainer.boot();
      }

      try {
        const instance = await bootPromise;
        webContainerInstance = instance; // Global save
        setWebContainer(instance);
        setIsReady(true);
        console.log("WebContainer Booted Successfully! 🚀");
      } catch (err) {
        console.error("WebContainer failed to boot:", err);
        bootPromise = null; // Reset taaki user refresh karke try kar sake
      }
    }

    boot();
  }, []);

  const runCommand = async (command: string, args: string[], onData: (data: string) => void) => {
    if (!webContainer) return;
    const process = await webContainer.spawn(command, args);
    process.output.pipeTo(new WritableStream({
      write(data) { onData(data); }
    }));
    return process.exit;
  };

  return { webContainer, isReady, runCommand };
}