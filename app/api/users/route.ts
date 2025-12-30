// app/api/users/route.ts

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
  createUser,
  listUsers,
} from "@/services/user.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await connectDB();
  await requireAuth(req);

  const url = new URL(req.url);
  const role = url.searchParams.get('role') || undefined;
  const isActive = url.searchParams.get('isActive') === 'true' ? true : url.searchParams.get('isActive') === 'false' ? false : undefined;
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const sortBy = url.searchParams.get('sortBy') || 'createdAt';
  const sortOrder = url.searchParams.get('sortOrder') === '1' ? 1 : -1;

  try {
    const users = await listUsers({
      role,
      isActive,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    return Response.json({ data: users });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  await connectDB();
  await requireAuth(req);

  const body = await req.json();

  try {
    const user = await createUser(body);
    return Response.json({ data: user }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}