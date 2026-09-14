import { cookies } from "next/headers";

const CART_SESSION_COOKIE = "lyra-cart-session";

export async function getCartSession() {
    const cookieStore = await cookies();

    return cookieStore.get(CART_SESSION_COOKIE)?.value;
}

export async function createCartSession() {
    const sessionId = crypto.randomUUID();

    const cookieStore = await cookies();

    cookieStore.set(CART_SESSION_COOKIE, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });

    return sessionId;
}

export async function getOrCreateCartSession() {
    const existingSessionId = await getCartSession();

    if (existingSessionId) {
        return existingSessionId;
    }

    return createCartSession();
}