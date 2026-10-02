import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = request.headers.get("x-razorpay-signature");

    if (!webhookSecret || !signature) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const rawBody = await request.text();

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const actualBuffer = Buffer.from(signature, "utf8");

    const isValid =
        expectedBuffer.length === actualBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, actualBuffer);

    if (!isValid) {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 401 }
        );
    }

    return NextResponse.json({ received: true });
}