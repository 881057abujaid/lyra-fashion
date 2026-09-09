"use client";

import { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } from "@/store/slices/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const testProduct = {
    productId: "test-product-1",
    name: "LYRA Classic Trouser",
    price: 1499,
    image: "/test-product.jpg",
    quantity: 1,
    size: "M",
};

export function ReduxCartTest() {
    const disatch = useAppDispatch();

    const cartItems = useAppSelector((state) => state.cart.items);

    const handleAddToCart = () => {
        disatch(addToCart(testProduct));
    };

    return (
        <section className="mx-auto max-w-7xl px-6 py-20">
            <div className="border border-lyra-border p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                    Redux Toolkit Test
                </p>

                <h2 className="font-display mt-4 text-4xl">
                    Cart Items: {cartItems.length}
                </h2>

                <div className="mt-8 flex gap-4">
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="bg-lyra-black px-6 py-3 text-xs uppercase tracking-[0.16em] text-lyra-white"
                    >
                        Add Test Product
                    </button>

                    <button
                        type="button"
                        onClick={() => disatch(clearCart())}
                        className="border border-lyra-border px-6 py-3 text-xs uppercase tracking-[0.16em]"
                    >
                        clear Cart
                    </button>
                </div>

                {cartItems.length > 0 && (
                    <div className="mt-8 border-t border-lyra-border pt-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.productId}
                                className="flex justify-between py-3 text-sm"
                            >
                                <span>{item.name}</span>
                                <span>₹{item.price}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}