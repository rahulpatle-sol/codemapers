import { createClient } from "@supabase/supabase-js";

import jsPDF from 'jspdf';

export const agentTools = {
  // --- DATABASE & FS TOOLS ---
  writeFile: async (projectId: string, path: string, content: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('files')
      .upsert({ 
        project_id: projectId, 
        name: path, // Note: Tune path split kiya tha, standard use karte hain
        content: content,
        updated_at: new Date() 
      })
      .select();
    if (error) throw new Error(`Write failed: ${error.message}`);
    return `File ${path} written.`;
  },

  // --- PRINTER / REPORT TOOLS ---
  printProjectReport: async (projectName: string, docs: { prd: string, srs: string, logs: string }) => {
    const doc = new jsPDF();
    
    // Page 1: Design
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text(`${projectName.toUpperCase()}`, 20, 50);
    doc.setFontSize(12);
    doc.text(`AI AGENT SYSTEM REPORT`, 20, 60);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 20, 70);

    // Page 2: PRD
    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("1. PRD (Product Requirements)", 20, 20);
    doc.setFontSize(10);
    const prdLines = doc.splitTextToSize(docs.prd || "No PRD generated.", 170);
    doc.text(prdLines, 20, 30);

    // Page 3: SRS
    doc.addPage();
    doc.setFontSize(18);
    doc.text("2. SRS (Technical Specs)", 20, 20);
    const srsLines = doc.splitTextToSize(docs.srs || "No SRS generated.", 170);
    doc.text(srsLines, 20, 30);

    doc.save(`${projectName}_Final_Report.pdf`);
    return "PDF Report generated and downloaded.";
  }
};