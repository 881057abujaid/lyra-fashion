import { prisma } from "../prisma";
import type { CreateOrderInput as CreateOrderInputAction } from "../actions/order.actions";

const FREE_SHIPPING_THRESHOLD = 1499;
const SHIPPING_FEE = 99;

type CreateOrderInput = {
    userId: string;

    customerName: string;
    customerEmail: string;
    customerPhone: string;

    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;

    subtotal: number;
    shipping: number;
    total: number;

    items: {
        productId: string;
        variantId: string;
        productName: string;
        productPrice: number;
        size: string;
        quantity: number;
        image: string;
    }[];
}

export async function createOrder(input: CreateOrderInput) {
    return prisma.order.create({
        data: {
            orderNumber: `LYRA-${Date.now()}`,

            userId: input.userId,

            customerName: input.customerEmail,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,

            shippingAddress: input.shippingAddress,
            shippingCity: input.shippingCity,
            shippingState: input.shippingState,
            shippingPincode: input.shippingPincode,

            subtotal: input.subtotal,
            shipping: input.shipping,
            total: input.total,

            items: {
                create: input.items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    productName: item.productName,
                    productPrice: item.productPrice,
                    size: item.size,
                    quantity: item.quantity,
                    image: item.image,
                })),
            },
        },
        include: {
            items: true,
        },
    });
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
                                product: true,
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
                orderNumber: `LYRA-${Date.now()}`,

                userId,

                status: "PENDING",
                paymentStatus: "PENDING",

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
                            item.variant.product.images[0] ?? "",
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