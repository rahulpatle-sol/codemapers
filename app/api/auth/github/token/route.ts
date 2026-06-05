import { NextResponse } from 'next/server';
import { getGitHubToken } from '@/app/lib/auth-utils';

export async function GET() {
  const token = await getGitHubToken();
  return NextResponse.json({ token: token || null });
}
