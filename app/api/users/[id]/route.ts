// app/api/users/[id]/route.ts

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  changeUserPassword,
} from "@/services/user.service";
import { Types } from "mongoose";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await requireAuth(req);

  try {
    const user = await getUserById(new Types.ObjectId(params.id));
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ data: user });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await requireAuth(req);

  const body = await req.json();

  try {
    const user = await updateUser({
      id: new Types.ObjectId(params.id),
      ...body,
    });
    return Response.json({ data: user });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await requireAuth(req);

  try {
    await deleteUser(new Types.ObjectId(params.id));
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await requireAuth(req);

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  try {
    if (action === 'activate') {
      const user = await activateUser(new Types.ObjectId(params.id));
      return Response.json({ data: user });
    } else if (action === 'deactivate') {
      const user = await deactivateUser(new Types.ObjectId(params.id));
      return Response.json({ data: user });
    } else if (action === 'changePassword') {
      const body = await req.json();
      const user = await changeUserPassword(new Types.ObjectId(params.id), body.newPassword);
      return Response.json({ data: user });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}