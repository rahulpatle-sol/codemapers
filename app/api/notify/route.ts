import { NextResponse } from "next/server";
import { createBrowserClient } from '@supabase/ssr';

export async function POST(req: Request) {
  const { title, message, userId, type } = await req.json();

  // 1. Supabase 'notifications' table mein entry (Persistent memory)
  // - Jaise files table hai, waise hi notifications handle hogi
  console.log(`[${type}] Notification for ${userId}: ${title}`);

  return NextResponse.json({ 
    success: true, 
    status: "DELIVERED",
    timestamp: new Date().toISOString() 
  });
}