"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart } from "lucide-react";

import { useAppSelector } from "@/store/hooks";

import { WishlistCard } from "./wishlist-card";

export function WishlistContent() {
    const items = useAppSelector((state) => state.wishlist.items);

    if (items.length === 0) {
        return (
            <div className="flex min-h-105 items-center justify-center">
                <div className="max-w-md text-center">
                    <Heart
                        size={28}
                        strokeWidth={1.2}
                        className="mx-auto"
                    />

                    <h2 className="font-display mt-6 text-3xl tracking-tight">
                        Your wishlist is empty
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-lyra-muted">
                        Save pieces you love and find them here whenever you&apos;re ready.
                    </p>

                    <Link
                        href="/shop"
                        className="mt-7 inline-block bg-lyra-black px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-85"
                    >
                        Explore Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10">
            <div className="mb-8 flex items-center justify-between">
                <p className="text-sm text-lyra-muted">
                    {items.length}{" "}
                    {items.length === 1 ? "Piece" : "Pieces"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-y-16">
                {items.map((item) => (
                    <WishlistCard
                        key={item.productId}
                        item={item}
                    />
                ))}
            </div>
        </div>
    );
}