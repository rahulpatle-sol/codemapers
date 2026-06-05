import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { query } from '@/app/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { rows } = await query(
    'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
    [user.id]
  );
  return NextResponse.json({ projects: rows });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, type } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

  const { rows } = await query(
    'INSERT INTO projects (name, type, user_id) VALUES ($1, $2, $3) RETURNING *',
    [name, type || 'next', user.id]
  );
  return NextResponse.json({ project: rows[0] });
}
