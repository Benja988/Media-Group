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
import { NextRequest } from "next/server";

type Params = { id: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  await connectDB();
  await requireAuth(req);

  try {
    const { id } = await params;

    const user = await getUserById(new Types.ObjectId(id));
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ data: user });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  await connectDB();
  await requireAuth(req);

  try {
    const { id } = await params;
    const body = await req.json();

    const user = await updateUser({
      id: new Types.ObjectId(id),
      ...body,
    });

    return Response.json({ data: user });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  await connectDB();
  await requireAuth(req);

  try {
    const { id } = await params;

    await deleteUser(new Types.ObjectId(id));
    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  await connectDB();
  await requireAuth(req);

  try {
    const { id } = await params;
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "activate") {
      const user = await activateUser(new Types.ObjectId(id));
      return Response.json({ data: user });
    }

    if (action === "deactivate") {
      const user = await deactivateUser(new Types.ObjectId(id));
      return Response.json({ data: user });
    }

    if (action === "changePassword") {
      const body = await req.json();
      const user = await changeUserPassword(
        new Types.ObjectId(id),
        body.newPassword
      );
      return Response.json({ data: user });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
