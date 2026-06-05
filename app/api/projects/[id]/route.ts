import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { query } from '@/app/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { rows } = await query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, user.id]);
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project: rows[0] });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (body.chat_history !== undefined) {
    fields.push(`chat_history = $${idx++}`);
    values.push(JSON.stringify(body.chat_history));
  }

  if (fields.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  values.push(id, user.id);
  const result = await query(
    `UPDATE projects SET ${fields.join(', ')}, updated_at = now() WHERE id = $${idx++} AND user_id = $${idx} RETURNING *`,
    values
  );

  if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project: result.rows[0] });
}
