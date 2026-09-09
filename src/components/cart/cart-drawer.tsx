"use client";

import { useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
} from "@/store/slices/cart/cartSlice";
import {
    useAppDispatch,
    useAppSelector,
} from "@/store/hooks";

type CartDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

export function CartDrawer({
    isOpen,
    onClose,
}: CartDrawerProps) {
    const dispatch = useAppDispatch();

    const cartItems = useAppSelector(
        (state) => state.cart.items
    );

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen, onClose]);

    return (
        <div
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-50 ${isOpen
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close cart"
                onClick={onClose}
                className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${isOpen
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
            />

            {/* Drawer */}
            <aside
                aria-label="Shopping cart"
                className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-lyra-cream shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen
                        ? "translate-x-0"
                        : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <header className="flex h-20 shrink-0 items-center justify-between border-b border-lyra-border px-6">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                            Your Bag
                        </p>

                        <p className="mt-1 font-display text-xl">
                            {cartItems.length}{" "}
                            {cartItems.length === 1
                                ? "Item"
                                : "Items"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close cart"
                        className="transition-transform duration-300 hover:rotate-90"
                    >
                        <X
                            size={22}
                            strokeWidth={1.5}
                        />
                    </button>
                </header>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <p className="font-display text-3xl">
                                Your bag is empty
                            </p>

                            <p className="mt-3 max-w-xs text-sm leading-6 text-lyra-muted">
                                Discover pieces designed
                                for effortless everyday
                                style.
                            </p>

                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-8 bg-lyra-black px-7 py-3 text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-7">
                            {cartItems.map((item) => (
                                <article
                                    key={`${item.productId}-${item.size}`}
                                    className="flex gap-4"
                                >
                                    {/* Product Image */}
                                    <div className="h-32 w-24 shrink-0 overflow-hidden bg-lyra-beige">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : null}
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm">
                                                {item.name}
                                            </h3>

                                            <p className="mt-1 text-xs text-lyra-muted">
                                                Size: {item.size}
                                            </p>
                                        </div>

                                        <div className="flex items-end justify-between gap-4">
                                            <span className="text-sm">
                                                ₹
                                                {item.price.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                            <div className="flex flex-col items-end gap-3">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-lyra-border">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                decreaseQuantity(
                                                                    {
                                                                        productId:
                                                                            item.productId,
                                                                        size: item.size,
                                                                    }
                                                                )
                                                            )
                                                        }
                                                        aria-label={`Decrease quantity of ${item.name}`}
                                                        className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-lyra-beige"
                                                    >
                                                        <Minus
                                                            size={14}
                                                            strokeWidth={
                                                                1.5
                                                            }
                                                        />
                                                    </button>

                                                    <span className="flex h-8 min-w-8 items-center justify-center border-x border-lyra-border px-2 text-xs">
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                increaseQuantity(
                                                                    {
                                                                        productId:
                                                                            item.productId,
                                                                        size: item.size,
                                                                    }
                                                                )
                                                            )
                                                        }
                                                        aria-label={`Increase quantity of ${item.name}`}
                                                        className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-lyra-beige"
                                                    >
                                                        <Plus
                                                            size={14}
                                                            strokeWidth={
                                                                1.5
                                                            }
                                                        />
                                                    </button>
                                                </div>

                                                {/* Remove */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            removeFromCart(
                                                                {
                                                                    productId:
                                                                        item.productId,
                                                                    size: item.size,
                                                                }
                                                            )
                                                        )
                                                    }
                                                    className="text-[10px] uppercase tracking-[0.14em] text-lyra-muted transition-colors hover:text-lyra-black"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="shrink-0 border-t border-lyra-border px-6 py-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.16em] text-lyra-muted">
                            Subtotal
                        </span>

                        <span className="font-display text-2xl">
                            ₹
                            {subtotal.toLocaleString(
                                "en-IN"
                            )}
                        </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-lyra-muted">
                        Shipping and taxes calculated at
                        checkout.
                    </p>

                    <button
                        type="button"
                        disabled={cartItems.length === 0}
                        className="mt-6 w-full bg-lyra-black px-6 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Checkout
                    </button>
                </footer>
            </aside>
        </div>
    );
}