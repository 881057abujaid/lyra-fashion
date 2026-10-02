import { NextResponse } from "next/server";
import { expirePendingOrders } from "@/lib/data/orders";

export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
        console.error("CRON_SECRET is not configured");

        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    const authorization = request.headers.get("authorization");

    if (authorization !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const result = await expirePendingOrders();

        return NextResponse.json({
            success: true,
            expiredCount: result.expiredCount,
        });
    } catch (error) {
        console.error("Failed to expire pending orders:", error);

        return NextResponse.json(
            { error: "Failed to expire pending orders" },
            { status: 500 }
        );
    }
}