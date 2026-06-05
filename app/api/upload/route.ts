import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/app/lib/cloudinary';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('project_id') as string;

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const raw = Buffer.from(await file.arrayBuffer());
    const isImage = file.type.startsWith('image/');
    let buffer: Buffer;

    // Optimize images
    if (isImage) {
      const img = sharp(raw);
      const meta = await img.metadata();
      if ((meta.width || 0) > 1920 || (meta.height || 0) > 1920) {
        img.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true });
      }
      buffer = await img.webp({ quality: 80 }).toBuffer();
    } else {
      buffer = raw;
    }

    const folder = projectId || user.id;

    // Cloudinary (production)
    if (isCloudinaryConfigured()) {
      const url = await uploadToCloudinary(buffer, folder, file.name);
      return NextResponse.json({ url, name: file.name, storage: 'cloudinary' });
    }

    // Local filesystem (dev fallback)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });
    const ext = isImage ? '.webp' : path.extname(file.name);
    const fileName = `${Date.now()}-${path.basename(file.name, path.extname(file.name))}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${folder}/${fileName}`;
    return NextResponse.json({ url, name: file.name, storage: 'local' });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
