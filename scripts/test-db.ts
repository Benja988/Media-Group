import { connectDB } from "../lib/db";
import { MediaGroup } from "../lib/models";

async function testDB() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected successfully ✅");

    const count = await MediaGroup.countDocuments();
    console.log(`MediaGroup documents count: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error("Database connection failed ❌", error);
    process.exit(1);
  }
}

testDB();
