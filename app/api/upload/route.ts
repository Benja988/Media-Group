import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '@/lib/api/response';
import { withAuth } from '@/lib/api/middleware';

// Create uploads directory if it doesn't exist
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  return await withAuth(request, async (req) => {
    try {
      await ensureUploadDir();
      
      const formData = await req.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return ApiResponse.error('No file provided', 400);
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return ApiResponse.error('File size exceeds 5MB limit', 400);
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return ApiResponse.error('Invalid file type. Only images are allowed', 400);
      }

      // Generate unique filename
      const fileExt = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Return the file URL
      const fileUrl = `/uploads/${fileName}`;
      
      return ApiResponse.success(
        { url: fileUrl, fileName: file.name, size: file.size, type: file.type },
        'File uploaded successfully'
      );

    } catch (error: any) {
      console.error('Upload error:', error);
      return ApiResponse.error('Failed to upload file', 500);
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};