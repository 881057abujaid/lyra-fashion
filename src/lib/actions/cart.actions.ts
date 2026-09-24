"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { addCartItem, mergeGuestCart, removeCartItem, updateCartItem } from "../data/cart";
import { getCartSession, getOrCreateCartSession, setCartSession } from "../cart-session";
import { auth } from "@/auth";

const addToCartSchema = z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().positive(),
});

export async function addToCartAction(variantId: string, quantity: number) {
    const validatedData = addToCartSchema.parse({ variantId, quantity, });

    const sessionId = await getOrCreateCartSession();

    const cart = await addCartItem(sessionId, validatedData.variantId, validatedData.quantity);

    revalidatePath("/cart");

    return cart;
}

export async function updateCartItemAction(variantId: string, quantity: number) {
    const validatedData = z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().positive(),
    }).parse({
        variantId,
        quantity,
    });

    const sessionId = await getCartSession();

    if (!sessionId) {
        throw new Error("Cart session not found");
    }

    const updatedItem = await updateCartItem(
        sessionId,
        validatedData.variantId,
        validatedData.quantity,
    );

    revalidatePath("/cart");

    return updatedItem;
}

export async function removeCartItemAction(variantId: string) {
    const validatedData = z.object({
        variantId: z.string().min(1),
    }).parse({
        variantId,
    });

    const sessionId = await getCartSession();

    if (!sessionId) {
        throw new Error("Cart session not found");
    }

    const deleteItem = await removeCartItem(sessionId, validatedData.variantId);

    revalidatePath("/cart");

    return deleteItem;
}

export async function mergeCurrentGuestCart() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    const guestSessionId = await getCartSession();

    if (!guestSessionId) {
        return null;
    }

    const cart = await mergeGuestCart(
        guestSessionId,
        session.user.id
    );

    if (cart) {
        await setCartSession(cart.sessionId);
    }

    revalidatePath("/cart");
    revalidatePath("/account");

    return cart;
}