import { prisma } from "@/lib/prisma";

export async function getAdminCustomers(search?: string) {
    const normalizedSearch = search?.trim();

    const customers = await prisma.user.findMany({
        where: {
            role: "CUSTOMER",
            ...(normalizedSearch
                ? {
                    OR: [
                        {
                            name: {
                                contains: normalizedSearch,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: normalizedSearch,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            _count: {
                select: {
                    orders: true,
                },
            },
            orders: {
                where: {
                    paymentStatus: "PAID",
                },
                select: {
                    total: true,
                },
            },
        },
    });

    return customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
        orderCount: customer._count.orders,
        totalSpent: customer.orders.reduce(
            (total, order) => total + order.total,
            0,
        ),
    }));
}

export async function getAdminCustomerById(customerId: string) {
    const customer = await prisma.user.findFirst({
        where: {
            id: customerId,
            role: "CUSTOMER",
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            orders: {
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    paymentStatus: true,
                    subtotal: true,
                    shipping: true,
                    total: true,
                    createdAt: true,
                    items: {
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
            },
        },
    });

    if (!customer) {
        return null;
    }

    const paidOrders = customer.orders.filter(
        (order) => order.paymentStatus === "PAID",
    );

    return {
        id: customer.id,
        name: customer.name,
        email: customer.name,
        createdAt: customer.createdAt,
        orders: customer.orders,
        orderCount: paidOrders.length,
        totalSpent: paidOrders.reduce(
            (total, order) => total + order.total, 0
        ),
    };
}