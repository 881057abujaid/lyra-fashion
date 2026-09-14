"use client";

import Link from "next/link";

import type { CartViewItem } from "@/lib/data/cart-view";

type CartSummaryProps = {
    items: CartViewItem[];
};

const FREE_SHIPPING_THRESHOLD = 1499;

export function CartSummary({ items }: CartSummaryProps) {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;

    const total = subtotal + shipping;

    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return (
        <aside className="sticky top-28 border border-lyra-border p-8 sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-lyra-muted">
                Order Summary
            </p>

            <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-lyra-muted">
                        Subtotal
                    </span>

                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-lyra-muted">
                        Shipping
                    </span>

                    <span>
                        {shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                </div>
            </div>

            {remainingForFreeShipping > 0 && (
                <div className="mt-6 border-t border-lyra-border pt-6">
                    <p className="text-xs leading-6 text-lyra-muted">
                        Add ₹{remainingForFreeShipping.toLocaleString("en-IN")}{" "} more to get free shipping.
                    </p>
                </div>
            )}

            <div className="mt-6 border-t border-lyra-border pt-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm">
                        Total
                    </span>

                    <span className="text-xl font-medium">
                        ₹{total.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>

            <Link
                href="/checkout"
                className="mt-9 flex w-full items-center justify-center bg-lyra-black px-6 py-4.5 text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity duration-300 hover:opacity-80"
            >
                Process to Checkout
            </Link>

            <p className="mt-4 text-center text-[10px] leading-5 tracking-wide text-lyra-subtle">
                Taxes and final shipping charges are calculated at checkout.
            </p>
        </aside>
    );
}