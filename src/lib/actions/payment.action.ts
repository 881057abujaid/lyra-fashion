"use server";

import { auth } from "@/auth";
import crypto from "crypto";
import { razorpayKeySecret } from "@/lib/razorpay";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    makeOrderPaymentFailed,
    getRazorpayOrderPaymentStatus,
} from "../data/orders";

export async function createRazorpayOrderAction(orderId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be signed in");
    }

    return createRazorpayOrder(orderId, session.user.id);
}

type verifyRazorpayPaymentInput = {
    orderId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
};

export async function verifyRazorpayPaymentAction(input: verifyRazorpayPaymentInput) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be signed in");
    }

    const {
        orderId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
    } = input;

    if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        throw new Error("Invalid payment verificaion data");
    }

    const generateaSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

    const isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(generateaSignature),
        Buffer.from(razorpaySignature),
    );

    if (!isSignatureValid) {
        throw new Error("Payment signature verification failed");
    }

    return verifyRazorpayPayment(
        orderId,
        session.user.id,
        razorpayOrderId,
        razorpayPaymentId,
    );
}

export async function makeOrderPaymentFailedAction(orderId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be signed in");
    }

    return makeOrderPaymentFailed(orderId, session.user.id);
}

export async function getRazorpayPaymentStatusAction(orderId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be signed in");
    }

    return getRazorpayOrderPaymentStatus(orderId, session.user.id);
}