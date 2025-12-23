import { connectDB } from "@/lib/db";
import { loginUser } from "@/services/auth.service";

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const result = await loginUser(body);
        return Response.json(result);
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 401 });
    }
}