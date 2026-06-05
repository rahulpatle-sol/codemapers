import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { checkRateLimit } from "@/app/lib/rate-limiter";

function buildSystemPrompt(projectType: string, currentFiles: any[]) {
  const isExpo = projectType === 'expo';
  const framework = isExpo ? 'React Native' : 'Frontend';
  const uiRule = isExpo
    ? 'Use React Native components (View, Text, StyleSheet, ScrollView, FlatList, etc). DO NOT use HTML tags (div, span, h1, p) or Tailwind CSS.'
    : 'Use Tailwind CSS, Framer Motion, and Lucide React. Designs must be "v0-level" (Modern, Dark Mode, Bento Grids).';
  const filePrefix = isExpo ? 'app' : 'src/components';

  return [
    'You are a Senior ' + framework + ' Architect.',
    'Current Files: ' + JSON.stringify(currentFiles),
    'Project Type: ' + (projectType || 'next'),
    '',
    'RULES:',
    '1. ' + uiRule,
    '2. Return ONLY this JSON structure:',
    '{',
    '  "message": "Explain what you built",',
    '  "files": [{ "path": "' + filePrefix + '/ComponentName.tsx", "content": "..." }],',
    '  "commands": []',
    '}',
    '3. File paths must start with "app/" for Expo, "src/" for Next/Vite.',
  ].join('\n');
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { message: `Rate limit hit. Try again in ${Math.ceil(resetIn / 1000)}s` },
      { status: 429, headers: { "X-RateLimit-Remaining": "0" } }
    );
  }

  try {
    const { prompt, history, currentFiles, projectType, apiKey } = await req.json();

    const groq = new Groq({ apiKey: apiKey || process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(projectType, currentFiles)
        },
        ...history.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text || m.content
        })),
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const usage = {
      promptTokens: completion.usage?.prompt_tokens || 0,
      completionTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
    };

    const response = NextResponse.json({
      ...JSON.parse(completion.choices[0].message.content!),
      usage,
    });

    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch (error: any) {
    const status = error?.status || 500;
    const message = status === 401
      ? "Invalid API key. Check your Groq key."
      : status === 429
      ? "Groq rate limit exceeded. Try again later."
      : "AI request failed.";
    return NextResponse.json({ message, usage: null }, { status });
  }
}
