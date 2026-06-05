import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { query } from '@/app/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { content } = await request.json();

  const { rows } = await query(
    'UPDATE files SET content = $1, updated_at = now() WHERE id = $2 RETURNING *',
    [content, id]
  );
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ file: rows[0] });
}
