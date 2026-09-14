import type { CartViewItem } from "../data/cart-view";

type CartWithItems = {
    items: {
        id: string;
        quantity: number;
        variant: {
            id: string;
            size: string;
            stock: number;
            product: {
                id: string;
                name: string;
                price: number;
                images: string[];
            };
        };
    }[];
};

export function mapCartToViewItem(cart: CartWithItems): CartViewItem[] {
    return cart.items.map((item) => ({
        id: item.id,
        productId: item.variant.product.id,
        variantId: item.variant.id,
        name: item.variant.product.name,
        price: item.variant.product.price,
        image: item.variant.product.images[0] ?? "",
        quantity: item.quantity,
        size: item.variant.size,
        stock: item.variant.stock,
    }))
}