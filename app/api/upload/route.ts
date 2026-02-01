import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { withAuth } from '@/lib/api/middleware';
import { uploadToCloudinary } from '@/services/upload.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return ApiResponse.error('No file provided', 400);
      }

      if (file.size > MAX_FILE_SIZE) {
        return ApiResponse.error('File exceeds 5MB limit', 400);
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        return ApiResponse.error('Invalid file type', 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await uploadToCloudinary(buffer, {
        folder: 'uploads',
        resourceType: 'image',
      });

      return ApiResponse.success(
        {
          url: uploaded.url,
          publicId: uploaded.publicId,
          originalName: file.name,
          size: file.size,
          type: file.type,
        },
        'File uploaded successfully'
      );
    } catch (error) {
      console.error(error);
      return ApiResponse.error('Upload failed', 500);
    }
  });
}
