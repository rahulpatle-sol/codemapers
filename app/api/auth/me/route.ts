import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
