// app/api/category/route.ts
import { connectDB } from "@/lib/db";
import {
  listCategories,
  createCategory,
  deleteCategory,
} from "@/services/category.service";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const data = await listCategories({
    type: searchParams.get("type") as any,
    isActive: searchParams.get("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined,
    parentId: searchParams.get("parentId")
      ? new Types.ObjectId(searchParams.get("parentId")!)
      : undefined,
    search: searchParams.get("search") ?? undefined,
  });

  return Response.json(data);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const category = await createCategory(body);

  return Response.json(category, { status: 201 });
}

export async function DELETE(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !Types.ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid category id" }, { status: 400 });
  }

  const category = await deleteCategory(new Types.ObjectId(id));

  return Response.json(category);
}
