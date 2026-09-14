import { getCartSession } from "../cart-session";
import { getCart } from "./cart";

export type CartViewItem = {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
    stock: number;
};

export type CartView = {
    id: string;
    items: CartViewItem[];
};

export async function getCurrentCart(): Promise<CartView | null> {
    const sessionId = await getCartSession();

    if (!sessionId) {
        return null;
    }

    const cart = await getCart(sessionId);

    if (!cart) {
        return null;
    }

    return {
        id: cart.id,
        items: cart.items.map((item) => ({
            id: item.id,
            productId: item.variant.product.id,
            variantId: item.variant.id,
            name: item.variant.product.name,
            price: item.variant.product.price,
            image: item.variant.product.images[0] ?? "",
            quantity: item.quantity,
            size: item.variant.size,
            stock: item.variant.stock,
        })),
    };
}