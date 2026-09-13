"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useAppSelector } from "@/store/hooks";

export function WishlistTrigger() {
    const wishlistCount = useAppSelector((state) => state.wishlist.items.length);

    return (
        <Link
            href="/wishlist"
            aria-label={`Wishlist with ${wishlistCount} items`}
            className="relative transition-opacity hover:opacity-60"
        >
            <Heart size={19} strokeWidth={1.5} />

            {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-lyra-black px-1 text-[9px] text-lyra-white">
                    {wishlistCount}
                </span>
            )}
        </Link>
    );
}