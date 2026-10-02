import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    let payload: {
        event?: string;
        id?: string;
    };

    try {
        payload = JSON.parse(rawBody);
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    const eventId = request.headers.get("x-razorpay-event-id");
    const event = payload.event;

    if (!eventId || !event) {
        return NextResponse.json(
            { error: "Invalid webhook payload" },
            { status: 400 }
        );
    }

    const existingEvent = await prisma.razorpayWebhookEvent.findUnique({
        where: {
            eventId,
        },
    });

    if (existingEvent) {
        return NextResponse.json({
            received: true,
            duplicate: true,
        });
    }

    await prisma.razorpayWebhookEvent.create({
        data: {
            eventId,
            event,
        },
    });

    return NextResponse.json({
        received: true,
    });
}