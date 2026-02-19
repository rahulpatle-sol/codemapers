import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt, history, currentFiles } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a Senior Frontend Architect. 
          Current Files: ${JSON.stringify(currentFiles)}
          
          RULES:
          1. Use Tailwind CSS, Framer Motion, and Lucide React.
          2. Designs must be "v0-level" (Modern, Dark Mode, Bento Grids).
          3. Return ONLY this JSON structure:
          {
            "message": "Explain what you built",
            "files": [{ "path": "src/components/Hero.tsx", "content": "..." }],
            "commands": ["npm install framer-motion lucide-react"]
          }`
        },
        ...history.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text || m.content
        })),
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content!));
  } catch (error) {
    return NextResponse.json({ message: "AI Limit Hit!" }, { status: 500 });
  }
}