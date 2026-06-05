import { query } from '../db';
import jsPDF from 'jspdf';

export const agentTools = {
  writeFile: async (projectId: string, path: string, content: string) => {
    const { rows } = await query(
      `INSERT INTO files (project_id, name, content, path)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (project_id, path) DO UPDATE SET content = $3, updated_at = now()
       RETURNING *`,
      [projectId, path.split('/').pop() || path, content, path]
    );

    if (!rows[0]) throw new Error('Write failed');
    return `File ${path} written.`;
  },

  printProjectReport: async (projectName: string, docs: { prd: string, srs: string, logs: string }) => {
    const doc = new jsPDF();
    
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text(`${projectName.toUpperCase()}`, 20, 50);
    doc.setFontSize(12);
    doc.text(`AI AGENT SYSTEM REPORT`, 20, 60);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 20, 70);

    doc.addPage();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("1. PRD (Product Requirements)", 20, 20);
    doc.setFontSize(10);
    const prdLines = doc.splitTextToSize(docs.prd || "No PRD generated.", 170);
    doc.text(prdLines, 20, 30);

    doc.addPage();
    doc.setFontSize(18);
    doc.text("2. SRS (Technical Specs)", 20, 20);
    const srsLines = doc.splitTextToSize(docs.srs || "No SRS generated.", 170);
    doc.text(srsLines, 20, 30);

    doc.save(`${projectName}_Final_Report.pdf`);
    return "PDF Report generated and downloaded.";
  }
};
