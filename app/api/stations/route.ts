import { connectDB } from "@/lib/db";
import { createStation } from "@/services/station.service";

export async function POST(req: Request) {
    await connectDB();
    const body = await req.json();

    try {
        const station = await createStation(body);
        return Response.json(station, {status: 201});
    } catch (err: any) {
        return Response.json(
            { error: err.message },
            { status: 400 }
        )
    }
}