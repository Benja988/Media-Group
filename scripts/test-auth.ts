import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectDB } from "../lib/db";
import { registerUser, loginUser } from "../services/auth.service";

async function test() {
  await connectDB();

  await registerUser({
    email: "admin01@media.com",
    password: "Secure123!",
    role: "super_admin",
  });

  const login = await loginUser({
    email: "admin01@media.com",
    password: "Secure123!",
  });

  // console.log(login.token);
  process.exit(0);
}

test();
