"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { CartView } from "@/lib/data/cart-view";

type CartPageProps = {
    cart: CartView | null;
}

export function CartPage({ cart }: CartPageProps) {
    const items = cart?.items ?? [];

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="mx-auto flex max-w-lg flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center border border-lyra-border">
                        <ShoppingBag size={24} strokeWidth={1.4} />
                    </div>

                    <p className="mt-8 text-xs uppercase tracking-[0.2em] text-lyra-muted">
                        Your Bag
                    </p>

                    <h1 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
                        Your bag is empty
                    </h1>

                    <p className="mt-5 max-w-sm text-sm leading-7 text-lyra-muted">
                        Discover pieces designed to bring effortless elegance to your wardrobe.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-8 px-6 py-3 inline-flex items-center gap-3 bg-lyra-black text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
            <div className="border-b border-lyra-border pb-6">
                <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                    Your Bag
                </p>

                <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                    Shopping Bag
                </h1>

                <p className="mt-3 text-sm text-lyra-muted">
                    {items.length}{" "}
                    {items.length === 1 ? "item" : "items"}
                </p>
            </div>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px] lg:items-start">
                <div>
                    <div className="border-t border-lyra-border">
                        {items.map((item) => (
                            <CartItem
                                key={`${item.productId}-${item.size}`}
                                variantId={item.variantId}
                                name={item.name}
                                price={item.price}
                                image={item.image}
                                quantity={item.quantity}
                                size={item.size}
                                stock={item.stock}
                            />
                        ))}
                    </div>

                    <Link
                        href="/shop"
                        className="group mt-8 inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.16em] text-lyra-muted transition-colors duration-300 hover:text-lyra-black uppercase"
                    >
                        <ArrowLeft
                            size={14}
                            strokeWidth={1.5}
                            className="transition-transform group-hover:-translate-x-1 duration-300"
                        />
                        Continue Shopping
                    </Link>
                </div>

                <CartSummary items={items} />
            </div>
        </main>
    );
}