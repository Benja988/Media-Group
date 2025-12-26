import { connectDB } from '@/lib/db'
import { registerUser } from '@/services/auth.service'

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const user = await registerUser(body)

    return Response.json(user, { status: 201 })
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? 'Unexpected server error' },
      { status: 400 }
    )
  }
}
