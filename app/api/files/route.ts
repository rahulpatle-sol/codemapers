import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { query } from '@/app/lib/db';

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('project_id');
  if (!projectId) return NextResponse.json({ error: 'project_id required' }, { status: 400 });

  const { rows } = await query(
    'SELECT * FROM files WHERE project_id = $1 ORDER BY path',
    [projectId]
  );
  return NextResponse.json({ files: rows });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { project_id, name, content, path } = body;
  if (!project_id || !name || !path) {
    return NextResponse.json({ error: 'project_id, name, path required' }, { status: 400 });
  }

  const { rows } = await query(
    'INSERT INTO files (project_id, name, content, path) VALUES ($1, $2, $3, $4) RETURNING *',
    [project_id, name, content || '', path]
  );
  return NextResponse.json({ file: rows[0] });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { project_id, name, content, path } = body;

  const { rows } = await query(
    `INSERT INTO files (project_id, name, content, path)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (project_id, path) DO UPDATE SET content = $3, updated_at = now()
     RETURNING *`,
    [project_id, name || path.split('/').pop(), content, path]
  );
  return NextResponse.json({ file: rows[0] });
}
