import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    confirmRazorpayPaymentFromWebhook,
    WebhookValidationError,
} from "@/lib/data/orders";

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
        payload?: {
            payment?: {
                entity?: {
                    id?: string;
                    order_id?: string;
                    amount?: number;
                    currency?: string;
                    status?: string;
                };
            };
        };
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

    let razorpayOrderId: string | undefined;
    let razorpayPaymentId: string | undefined;
    let razorpayAmount: number | undefined;
    let razorpayCurrency: string | undefined;
    let razorpayStatus: string | undefined;

    if (event === "payment.captured") {
        const payment = payload.payload?.payment?.entity;

        razorpayOrderId = payment?.order_id;
        razorpayPaymentId = payment?.id;
        razorpayAmount = payment?.amount;
        razorpayCurrency = payment?.currency;
        razorpayStatus = payment?.status;

        if (
            !razorpayOrderId ||
            !razorpayPaymentId ||
            typeof razorpayAmount !== "number" ||
            !Number.isFinite(razorpayAmount) ||
            !Number.isInteger(razorpayAmount) ||
            razorpayAmount <= 0 ||
            typeof razorpayCurrency !== "string" ||
            typeof razorpayStatus !== "string"
        ) {
            return NextResponse.json(
                { error: "Invalid payment webhook payload" },
                { status: 400 }
            );
        }
    }

    let result: {
        duplicate: boolean;
        validationError?: string;
    };

    try {
        result = await prisma.$transaction(async (tx) => {
            const eventResult = await tx.razorpayWebhookEvent.createMany({
                data: {
                    eventId,
                    event,
                },
                skipDuplicates: true,
            });

            if (eventResult.count === 0) {
                return { duplicate: true };
            }

            if (event === "payment.captured" && razorpayOrderId) {
                try {
                    await confirmRazorpayPaymentFromWebhook(
                        tx,
                        razorpayOrderId,
                        razorpayPaymentId!,
                        razorpayAmount!,
                        razorpayCurrency!,
                        razorpayStatus!,
                    );
                } catch (err) {
                    if (err instanceof WebhookValidationError) {
                        // Permanent business condition — event is already persisted.
                        // Do NOT rethrow; let the transaction commit the event record.
                        console.error(
                            "Razorpay webhook validation error (event recorded, payment not processed):",
                            err.message,
                        );
                        return { duplicate: false, validationError: err.message };
                    }
                    // Transient/unexpected error — rethrow to roll back the transaction
                    // so Razorpay can retry.
                    throw err;
                }
            }

            return { duplicate: false };
        });
    } catch (error) {
        // Transient failure: transaction rolled back, Razorpay will retry.
        console.error("Razorpay webhook processing failed:", error);

        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }

    if (result.duplicate) {
        return NextResponse.json({
            received: true,
            duplicate: true,
        });
    }

    if (result.validationError) {
        return NextResponse.json({
            received: true,
            ignored: true,
        });
    }

    return NextResponse.json({
        received: true,
    });
}