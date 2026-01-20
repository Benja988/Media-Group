import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import {
  listMediaGroups,
  createMediaGroup,
} from "@/services/mediaGroup.service";

const ALLOWED_STATUS = ["active", "inactive", "archived"] as const;
const ALLOWED_SORT_FIELDS = ["createdAt", "name", "status"] as const;

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);


    const statusParam = searchParams.get("status");
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder");


    const status = ALLOWED_STATUS.includes(statusParam as any)
      ? (statusParam as "active" | "inactive" | "archived")
      : undefined;

    const sortBy = ALLOWED_SORT_FIELDS.includes(sortByParam as any)
      ? (sortByParam as "createdAt" | "name" | "status")
      : "createdAt";

    const sortOrder: 1 | -1 =
      sortOrderParam === "1" ? 1 : -1;


    const limit =
      limitParam && !Number.isNaN(Number(limitParam))
        ? Number(limitParam)
        : undefined;

    const offset =
      offsetParam && !Number.isNaN(Number(offsetParam))
        ? Number(offsetParam)
        : undefined;


    const mediaGroups = await listMediaGroups({
      status,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    return Response.json(mediaGroups, { status: 200 });
  } catch (err) {
    console.error("GET /api/media-groups failed:", err);

    return Response.json(
      { error: "Failed to fetch media groups" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const user = requireAuth(req);

    const body = await req.json();
    const mediaGroup = await createMediaGroup(body);

    return Response.json(mediaGroup, { status: 201 });
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return Response.json({ error: err.message }, { status: 400 });
  }
}


