import { GoogleGenerativeAI } from "@google/generative-ai";

// API Key ko .env.local mein zaroori save karna (NEXT_PUBLIC_GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });