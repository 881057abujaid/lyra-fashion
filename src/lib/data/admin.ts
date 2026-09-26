import { prisma } from "../prisma";
import type { PaymentStatus, OrderStatus } from "@/generated/prisma/enums";

export type AdminOrder = {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
}

export type AdminOrderFilters = {
    search?: string;
    paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    orderStatus?: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
}

export type AdminOrderResult = {
    orders: AdminOrder[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export async function getAdminDashboardStats() {
    const [
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueResult,
        recentOrders,
    ] = await Promise.all([
        prisma.order.count(),
        prisma.user.count({
            where: {
                role: "CUSTOMER",
            },
        }),

        prisma.product.count(),
        prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                paymentStatus: "PAID"
            },
        }),

        prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                total: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
            },
        }),
    ]);

    return {
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue: revenueResult._sum.total ?? 0,
        recentOrders,
    };
}

export async function getAdminOrders(
    filters: AdminOrderFilters = {},
    page = 1,
    pageSize = 20
): Promise<AdminOrderResult> {
    const search = filters.search?.trim();

    const where = {
        ...(search
            ? {
                OR: [
                    {
                        orderNumber: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        customerName: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        customerEmail: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),

        ...(filters.paymentStatus
            ? {
                paymentStatus: filters.paymentStatus,
            }
            : {}),

        ...(filters.orderStatus
            ? {
                status: filters.orderStatus,
            }
            : {}),
    };

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip: (safePage - 1) * safePageSize,
            take: safePageSize,
            select: {
                id: true,
                orderNumber: true,
                customerName: true,
                customerEmail: true,
                total: true,
                status: true,
                paymentStatus: true,
                createdAt: true,
            }
        }),

        prisma.order.count({
            where,
        }),
    ]);

    return {
        orders,
        total,
        page: safePage,
        pageSize: safePageSize,
        totalPages: Math.ceil(total / safePageSize),
    };
}

export async function getAdminOrderById(id: string) {
    return prisma.order.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            orderNumber: true,
            status: true,
            paymentStatus: true,

            subtotal: true,
            shipping: true,
            total: true,

            customerName: true,
            customerEmail: true,
            customerPhone: true,

            shippingAddress: true,
            shippingCity: true,
            shippingState: true,
            shippingPincode: true,

            razorpayOrderId: true,

            createdAt: true,
            updatedAt: true,

            items: {
                orderBy: {
                    createdAt: "asc",
                },
                select: {
                    id: true,
                    productName: true,
                    productPrice: true,
                    size: true,
                    quantity: true,
                    image: true,
                },
            },
        },
    });
}

export async function updateAdminOrderStatus(orderId: string, nextStatus: OrderStatus) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: {
                    select: {
                        variantId: true,
                        quantity: true,
                    },
                },
            },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === nextStatus) {
            return order;
        }

        const allowedTransitions: Record<
            OrderStatus,
            OrderStatus[]
        > = {
            PENDING: ["CONFIRMED", 'CANCELLED'],
            CONFIRMED: ["PROCESSING"],
            PROCESSING: ["SHIPPED"],
            SHIPPED: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: [],
        };

        const allowedNextStatuses = allowedTransitions[order.status];

        if (!allowedNextStatuses.includes(nextStatus)) {
            throw new Error(`Cannot change order status from ${order.status} to ${nextStatus}`);
        }

        if (nextStatus === "CANCELLED") {
            if (order.paymentStatus !== "PENDING") {
                throw new Error("Paid orders cannot be cancelled until refund refund support is available")
            }
        }

        for (const item of order.items) {
            if (!item.variantId) continue;

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

        return await tx.order.update({
            where: {
                id: order.id,
            },
            data: {
                status: nextStatus,
            },
        });
    });
}