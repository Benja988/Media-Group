// app/api/category/[id]/route.ts
import { connectDB } from "@/lib/db";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/services/category.service";
import { Types } from "mongoose";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  console.log("Searching for category ID:", id);
  console.log("Is valid ObjectId?", Types.ObjectId.isValid(id));

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid category id" }, { status: 400 });
  }

  const category = await getCategoryById(new Types.ObjectId(id));
  console.log("Found category:", category);

  return Response.json(category);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid category id" }, { status: 400 });
  }

  const category = await updateCategory({
    id: new Types.ObjectId(id),
    ...body,
  });

  return Response.json(category);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  if (!Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid category id" }, { status: 400 });
  }

  await deleteCategory(new Types.ObjectId(id));

  return Response.json({ success: true });
}
