import { connectDB } from "@/lib/db";
import { requireAuth } from "@/middleware/auth";
import { createUser, listUsers } from "@/services/user.service";

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Authenticate user
    // const authUser = requireAuth(req);

    // Parse query parameters
    const url = new URL(req.url);
    const role = url.searchParams.get("role") || undefined;
    const isActiveParam = url.searchParams.get("isActive");
    const isActive =
      isActiveParam === "true" ? true : isActiveParam === "false" ? false : undefined;

    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") === "1" ? 1 : -1;

    // Fetch users
    const users = await listUsers({
      role,
      isActive,
      limit,
      offset,
      sortBy,
      sortOrder,
    });
    console.log({data: users});
    return Response.json({ data: users }, { status: 200 });
    
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    // Authenticate user
    // const authUser = requireAuth(req);

    // Parse body and create user
    const body = await req.json();
    const user = await createUser(body);

    return Response.json({ data: user }, { status: 201 });
  } catch (err: any) {
    if (err.message === "Unauthorized") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    return Response.json({ error: err.message }, { status: 400 });
  }
}
