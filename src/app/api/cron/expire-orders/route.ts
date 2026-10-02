import { NextResponse } from "next/server";
import { expirePendingOrders } from "@/lib/data/orders";

export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");

    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const result = await expirePendingOrders();

    return NextResponse.json(result);
}