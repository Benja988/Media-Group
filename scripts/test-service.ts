import { connectDB } from "@/lib/db";
import { createMediaGroup } from "@/services/mediaGroup.service";

async function test() {
    await connectDB();

    const group = await createMediaGroup({
        name: "Demo Media Group",
        slug: "demo-media"
    });

    console.log(group);
    process.exit(0);
}

test();