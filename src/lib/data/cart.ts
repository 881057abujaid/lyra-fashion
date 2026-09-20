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

export async function mergeGuestCart(
    guestSessionId: string,
    userId: string
) {
    return prisma.$transaction(async (tx) => {
        const guestCart = await tx.cart.findUnique({
            where: {
                sessionId: guestSessionId,
            },
            include: cartInclude,
        });

        if (!guestCart) {
            return null;
        }

        const userCart = await tx.cart.findFirst({
            where: {
                userId,
            },
            include: cartInclude,
        });

        // User doesn't have an existing cart.
        // Simply attach the guest cart to the user.
        if (!userCart) {
            return tx.cart.update({
                where: {
                    id: guestCart.id,
                },
                data: {
                    userId,
                },
                include: cartInclude,
            });
        }

        // Merge guest items into the existing user cart.
        for (const guestItem of guestCart.items) {
            const existingItem = userCart.items.find(
                (item) =>
                    item.variantId === guestItem.variantId
            );

            if (existingItem) {
                const variant =
                    await tx.productVariant.findUnique({
                        where: {
                            id: guestItem.variantId,
                        },
                        select: {
                            stock: true,
                        },
                    });

                if (!variant) {
                    continue;
                }

                const mergedQuantity =
                    existingItem.quantity +
                    guestItem.quantity;

                const quantity = Math.min(
                    mergedQuantity,
                    variant.stock
                );

                if (quantity <= 0) {
                    await tx.cartItem.delete({
                        where: {
                            id: existingItem.id,
                        },
                    });

                    continue;
                }

                await tx.cartItem.update({
                    where: {
                        id: existingItem.id,
                    },
                    data: {
                        quantity,
                    },
                });
            } else {
                const variant =
                    await tx.productVariant.findUnique({
                        where: {
                            id: guestItem.variantId,
                        },
                        select: {
                            stock: true,
                        },
                    });

                if (!variant || variant.stock <= 0) {
                    continue;
                }

                await tx.cartItem.create({
                    data: {
                        cartId: userCart.id,
                        variantId: guestItem.variantId,
                        quantity: Math.min(
                            guestItem.quantity,
                            variant.stock
                        ),
                    },
                });
            }
        }

        // Guest cart is no longer needed.
        await tx.cart.delete({
            where: {
                id: guestCart.id,
            },
        });

        return tx.cart.findUnique({
            where: {
                id: userCart.id,
            },
            include: cartInclude,
        });
    });
}