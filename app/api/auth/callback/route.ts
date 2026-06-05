import { NextResponse } from 'next/server';
import { setSessionCookie, findOrCreateUser, getCurrentSession } from '@/app/lib/auth-utils';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || 'github';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_params`);
  }

  try {
    // Handle repo-scoped OAuth (connect GitHub for push)
    if (state === 'github_repo') {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) throw new Error('Failed to get GitHub token');

      const existing = await getCurrentSession();
      if (existing) {
        await setSessionCookie({ ...existing, githubToken: tokenData.access_token });
      }
      return NextResponse.redirect(`${origin}/project/${searchParams.get('project_id') || ''}`);
    }

    let userEmail: string;
    let userName: string | null;

    if (state === 'github') {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) throw new Error('Failed to get GitHub token');

      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await userRes.json();
      userEmail = userData.email;
      userName = userData.name || userData.login;

      if (!userEmail) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const emails = await emailsRes.json();
        userEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email;
      }
    } else if (state === 'google') {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
          grant_type: 'authorization_code',
        }),
      });
      const tokenData = await tokenRes.json();
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      const userData = await userRes.json();
      userEmail = userData.email;
      userName = userData.name;
    } else {
      return NextResponse.redirect(`${origin}/login?error=invalid_provider`);
    }

    const user = await findOrCreateUser(userEmail, userName);
    await setSessionCookie({ userId: user.id, email: user.email, name: user.name });

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (err) {
    console.error('Auth callback error:', err);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
