import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  fileName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `codemapers/${folder}`,
        public_id: fileName.replace(/\.[^.]+$/, ''),
        resource_type: 'auto',
        transformation: [
          { width: 1920, height: 1920, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (err, result) => {
        if (err || !result) reject(err || new Error('Upload failed'));
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export function isCloudinaryConfigured(): boolean {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
