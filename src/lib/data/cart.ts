import { prisma } from "../prisma";

const cartInclude = {
    items: {
        include: {
            variant: {
                include: {
                    product: true,
                },
            },
        },
        orderBy: {
            createdAt: "asc" as const,
        },
    },
};

export async function getCart(sessionId: string) {
    return prisma.cart.findUnique({
        where: {
            sessionId,
        },
        include: cartInclude,
    });
}

export async function createCart(sessionId: string) {
    return prisma.cart.create({
        data: {
            sessionId,
        },
        include: cartInclude,
    });
}

export async function getOrCreateCart(sessionId: string) {
    const existingCart = await getCart(sessionId);

    if (existingCart) {
        return existingCart;
    }

    return createCart(sessionId);
}

export async function addCartItem(sessionId: string, variantId: string, quantity: number) {
    const cart = await getOrCreateCart(sessionId);

    const variant = await prisma.productVariant.findUnique({
        where: {
            id: variantId,
        },
    });

    if (!variant) {
        throw new Error("Product variant not found");
    }

    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_variantId: {
                cartId: cart.id,
                variantId,
            },
        },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    if (newQuantity > variant.stock) {
        throw new Error("Request quantity exceeds available stock");
    }

    if (existingItem) {
        await prisma.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: newQuantity,
            },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                quantity,
            },
        });
    }

    return getCart(sessionId);
}

export async function updateCartItem(sessionId: string, variantId: string, quantity: number) {
    const cart = await getCart(sessionId);

    if (!cart) {
        throw new Error("Cart not found");
    }

    if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero");
    }

    const variant = await prisma.productVariant.findUnique({
        where: {
            id: variantId,
        },
    });

    if (!variant) {
        throw new Error("Product variant not found");
    }

    if (quantity > variant.stock) {
        throw new Error("Requested quantity exceeds available stock");
    }

    const cartItem = await prisma.cartItem.findUnique({
        where: {
            cartId_variantId: {
                cartId: cart.id,
                variantId,
            },
        },
    });

    if (!cartItem) {
        throw new Error("Cart item not found");
    }

    await prisma.cartItem.update({
        where: {
            id: cartItem.id,
        },
        data: {
            quantity,
        },
    });

    return getCart(sessionId);
}

export async function removeCartItem(sessionId: string, variantId: string) {
    const cart = await getCart(sessionId);

    if (!cart) {
        throw new Error("Cart not found");
    }

    const cartItem = await prisma.cartItem.findUnique({
        where: {
            cartId_variantId: {
                cartId: cart.id,
                variantId,
            },
        },
    });

    if (!cartItem) {
        throw new Error("Cart item not found");
    }

    await prisma.cartItem.delete({
        where: {
            id: cartItem.id,
        },
    });

    return getCart(sessionId);
}

export async function clearCart(sessionId: string) {
    const cart = await getCart(sessionId);

    if (!cart) {
        return null;
    }

    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });

    return cart;
}