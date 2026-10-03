import crypto from "crypto";
import { prisma } from "../prisma";
import type { Prisma } from "@/generated/prisma/client";
import { razorpay } from "../razorpay";
import type { CreateOrderInput as CreateOrderInputAction } from "../actions/order.actions";

const FREE_SHIPPING_THRESHOLD = 1499;
const SHIPPING_FEE = 99;

export class WebhookValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WebhookValidationError";
    }
}

export async function createOrderFromCart(userId: string, input: CreateOrderInputAction) {
    return prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findFirst({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: {
                                            orderBy: {
                                                sortOrder: "asc",
                                            },
                                            select: {
                                                url: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new Error("Your cart is empty");
        }

        const subtotal = cart.items.reduce(
            (total, item) =>
                total +
                item.variant.product.price * item.quantity,
            0
        );

        const shipping =
            subtotal >= FREE_SHIPPING_THRESHOLD
                ? 0
                : SHIPPING_FEE;

        const total = subtotal + shipping;

        /*
         * Reserve stock atomically.
         *
         * The WHERE condition makes sure that the variant
         * still has enough stock at the exact moment we
         * attempt to decrease it.
         */
        for (const item of cart.items) {
            const updatedVariant =
                await tx.productVariant.updateMany({
                    where: {
                        id: item.variant.id,
                        stock: {
                            gte: item.quantity,
                        },
                    },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });

            if (updatedVariant.count === 0) {
                throw new Error(
                    `${item.variant.product.name} (${item.variant.size}) is no longer available in the requested quantity`
                );
            }
        }

        const order = await tx.order.create({
            data: {
                orderNumber: `LYRA-${Date.now()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,

                userId,

                status: "PENDING",
                paymentStatus: "PENDING",
                paymentExpiresAt: new Date(Date.now() + 15 * 60 * 1000),

                subtotal,
                shipping,
                total,

                customerName: input.customerName,
                customerEmail: input.customerEmail,
                customerPhone: input.customerPhone,

                shippingAddress: input.shippingAddress,
                shippingCity: input.shippingCity,
                shippingState: input.shippingState,
                shippingPincode: input.shippingPincode,

                items: {
                    create: cart.items.map((item) => ({
                        productId: item.variant.product.id,
                        variantId: item.variant.id,
                        productName: item.variant.product.name,
                        productPrice: item.variant.product.price,
                        size: item.variant.size,
                        quantity: item.quantity,
                        image:
                            item.variant.product.images[0]?.url ?? "",
                    })),
                },
            },

            include: {
                items: true,
            },
        });

        await tx.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });

        return order;
    });
}

export async function getOrderByNumber(
    orderNumber: string,
    userId: string
) {
    return prisma.order.findFirst({
        where: {
            orderNumber,
            userId,
        },
        include: {
            items: true,
        },
    });
}

export async function getUserOrders(userId: string) {
    return prisma.order.findMany({
        where: {
            userId,
        },
        include: {
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createRazorpayOrder(
    orderId: string,
    userId: string
) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.status !== "PENDING" || order.paymentStatus !== "PENDING") {
        throw new Error(
            "This order is no longer available for payment. Please place a new order."
        );
    }

    if (order.razorpayOrderId) {
        return {
            razorpayOrderId: order.razorpayOrderId,
            amount: order.total * 100,
            currency: "INR"
        };
    }

    const razorpayOrder = await razorpay.orders.create({
        amount: order.total * 100,
        currency: "INR",
        receipt: order.orderNumber,
    });

    await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            razorpayOrderId: razorpayOrder.id,
        },
    });

    return {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
    };
}

export async function verifyRazorpayPayment(
    orderId: string,
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.razorpayOrderId !== razorpayOrderId) {
        throw new Error("Razorpay order does not match");
    }

    if (order.paymentStatus === "PAID") {
        return order;
    }

    if (order.paymentStatus !== "PENDING" || order.status !== "PENDING") {
        throw new Error("This order is no longer available for payment");
    }

    const updatedOrder = await prisma.order.updateMany({
        where: {
            id: order.id,
            paymentStatus: "PENDING",
            status: "PENDING",
        },
        data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            razorpayPaymentId,
        },
    });

    if (updatedOrder.count === 0) {
        throw new Error("This order is no longer available for payment");
    }

    return prisma.order.findUnique({
        where: {
            id: order.id,
        },
        include: {
            items: true,
        },
    });
}

export async function makeOrderPaymentFailed(
    orderId: string,
    userId: string,
) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        // A paid order must never be marked as failed.
        if (order.paymentStatus === "PAID") {
            throw new Error("A paid order cannot be marked as failed");
        }

        // Atomically transition the order to FAILED/CANCELLED.
        // Only a still-pending order can make this transition.
        const updatedOrder = await tx.order.updateMany({
            where: {
                id: order.id,
                paymentStatus: "PENDING",
                status: "PENDING",
            },
            data: {
                paymentStatus: "FAILED",
                status: "CANCELLED",
            },
        });

        // Another request already handled this order.
        if (updatedOrder.count === 0) {
            return order;
        }

        // This request successfully owned the state transition,
        // so it is responsible for releasing the reserved stock.
        for (const item of order.items) {
            if (!item.variantId) {
                continue;
            }

            await tx.productVariant.update({
                where: {
                    id: item.variantId,
                },
                data: {
                    stock: {
                        increment: item.quantity,
                    },
                },
            });
        }

        return tx.order.findUnique({
            where: {
                id: order.id,
            },
            include: {
                items: true,
            },
        });
    });
}

export async function getRazorpayOrderPaymentStatus(
    orderId: string,
    userId: string,
) {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (!order.razorpayOrderId) {
        throw new Error("Razorpay order has not been created");
    }

    const payments = await razorpay.orders.fetchPayments(order.razorpayOrderId);

    return {
        order,
        payments: payments.items,
    };
}

export async function expirePendingOrders() {
    const now = new Date();

    const expiredOrders = await prisma.order.findMany({
        where: {
            status: "PENDING",
            paymentStatus: "PENDING",
            paymentExpiresAt: {
                lte: now,
            },
        },
        include: {
            items: true,
        },
    });

    let expiredCount = 0;

    for (const order of expiredOrders) {
        /*
         * Before releasing stock, check Razorpay.
         *
         * A payment may have succeeded even though
         * our application has not processed the callback yet.
         */
        if (order.razorpayOrderId) {
            try {
                const payments = await razorpay.orders.fetchPayments(
                    order.razorpayOrderId
                );

                const successfulPayment = payments.items.find(
                    (payment) => payment.status === "captured"
                );

                if (successfulPayment) {
                    await prisma.order.updateMany({
                        where: {
                            id: order.id,
                            status: "PENDING",
                            paymentStatus: "PENDING",
                        },
                        data: {
                            paymentStatus: "PAID",
                            status: "CONFIRMED",
                        },
                    });

                    continue;
                }
            } catch (error) {
                console.error(
                    `Failed to check Razorpay payment for order ${order.orderNumber}:`,
                    error
                );

                /*
                 * If Razorpay cannot be checked, do not release
                 * stock blindly. The order can be checked again
                 * during the next expiration run.
                 */
                continue;
            }
        }

        /*
         * Atomically transition the order and restore stock.
         *
         * If any stock update fails, the entire transaction
         * rolls back, including the order state change.
         */
        const expired = await prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.order.updateMany({
                where: {
                    id: order.id,
                    status: "PENDING",
                    paymentStatus: "PENDING",
                },
                data: {
                    paymentStatus: "FAILED",
                    status: "CANCELLED",
                },
            });

            /*
             * Another process already handled this order.
             * Do not restore stock again.
             */
            if (updatedOrder.count === 0) {
                return false;
            }

            /*
             * This transaction successfully claimed the order
             * for expiration, so it owns stock restoration.
             */
            for (const item of order.items) {
                await tx.productVariant.update({
                    where: {
                        id: item.variantId,
                    },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }

            return true;
        });

        if (expired) {
            expiredCount++;
        }
    }

    return {
        expiredCount,
    };
}

export async function confirmRazorpayPaymentFromWebhook(
    tx: Prisma.TransactionClient,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpayAmount: number,
    razorpayCurrency: string,
    razorpayStatus: string,
) {
    const order = await tx.order.findFirst({
        where: { razorpayOrderId },
    });

    if (!order) {
        throw new WebhookValidationError(
            "Order not found for Razorpay webhook",
        );
    }

    // Validate the signed Razorpay webhook payload
    // before changing the order payment state.
    const expectedAmount = Math.round(order.total * 100);

    if (razorpayAmount !== expectedAmount) {
        throw new WebhookValidationError(
            "Razorpay payment amount does not match order total",
        );
    }

    if (razorpayCurrency !== "INR") {
        throw new WebhookValidationError(
            "Unsupported Razorpay payment currency",
        );
    }

    if (razorpayStatus !== "captured") {
        throw new WebhookValidationError(
            "Razorpay payment is not captured",
        );
    }

    // Idempotency: if this order is already paid,
    // don't process it again.
    if (order.paymentStatus === "PAID") {
        return order;
    }

    if (
        order.paymentStatus !== "PENDING" ||
        order.status !== "PENDING"
    ) {
        console.error(
            `[CRITICAL_PAYMENT_MISMATCH] Payment captured (${razorpayAmount} ${razorpayCurrency}) for order ${order.orderNumber} with non-pending status (status: ${order.status}, paymentStatus: ${order.paymentStatus}). Order was NOT updated. Manual reconciliation required.`,
        );
        throw new WebhookValidationError(
            "Order is no longer pending payment",
        );
    }

    const updatedOrder = await tx.order.updateMany({
        where: {
            id: order.id,
            razorpayOrderId,
            paymentStatus: "PENDING",
            status: "PENDING",
        },
        data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            razorpayPaymentId,
        },
    });

    if (updatedOrder.count === 0) {
        const freshOrder = await tx.order.findUnique({
            where: { id: order.id },
        });

        if (freshOrder?.paymentStatus === "PAID") {
            return freshOrder;
        }

        throw new Error(
            "Order payment state changed during webhook processing",
        );
    }

    return tx.order.findUnique({
        where: { id: order.id },
    });
}

export async function refundOrder(orderId: string) {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
    });

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.paymentStatus !== "PAID") {
        throw new Error("Only paid orders can be refunded");
    }

    if (!order.razorpayPaymentId) {
        throw new Error("Razorpay payment ID is missing");
    }

    if (order.razorpayRefundId) {
        throw new Error("Order has already been refunded");
    }

    const refund = await razorpay.payments.refund(
        order.razorpayPaymentId,
        {
            amount: Math.round(order.total * 100),
        },
    );

    if (!refund.id) {
        throw new Error("Razorpay refund was not created");
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: order.id,
        },
        data: {
            paymentStatus: "REFUNDED",
            razorpayRefundId: refund.id,
            refundedAt: new Date(),
        },
    });

    return updatedOrder;
}