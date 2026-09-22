"use client";

import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

const FREE_SHIPPING_THRESHOLD = 1499;
const SHIPPING_FEE = 99;

export function OrderSummary() {
    const cartItems = useAppSelector((state) => state.cart.items);
    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity, 0
    );

    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shipping;

    return (
        <div>
            {/* Products */}
            <div className="space-y-6">
                {cartItems.map((item) => (
                    <div
                        key={item.variantId}
                        className="flex gap-4"
                    >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-lyra-beige">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-lyra-beige" />
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-ms">
                                {item.name}
                            </p>

                            <p className="mt-1 text-xs text-lyra-muted">
                                {item.size} • Qty {item.quantity}
                            </p>

                            <p className="mt-3 text-sm">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {cartItems.length === 0 && (
                <p className="py-8 text-sm text-lyra-muted">
                    Your bag is empty.
                </p>
            )}

            {/* Total */}
            <div className="mt-10 border-t border-lyra-border pt-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-lyra-muted">
                        Subtotal
                    </span>

                    <span>
                        ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                </div>

                <div className="mt-6 border-t border-lyra-border">
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.16em]">
                            Total
                        </span>

                        <span className="font-display text-2xl">
                            ₹{total.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Shipping message */}
            {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="mt-6 text-xs leading-5 text-lyra-muted">
                    Add ₹{(
                        FREE_SHIPPING_THRESHOLD - subtotal
                    ).toLocaleString("en-IN")}{" "}
                    more to get free shipping.
                </p>
            )}
        </div>
    );
}