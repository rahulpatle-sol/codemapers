import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Supabase se aane wale triggers ko handle karne ke liye
  const body = await req.json();
  
  console.log("Webhook received:", body.type);

  // Logic: Jab file delete ho, toh storage se clean up karo
  
  return NextResponse.json({ received: true });
}