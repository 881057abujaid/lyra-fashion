"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { useAppDispatch, useAppSelector } from "./hooks";
import { hydrateWishlist } from "./slices/wishlist/wishlistSlice";
import { hydrateCart } from "./slices/cart/cartSlice";
import { getCurrentCartAction } from "@/lib/actions/auth.actions";

export function StorePersistence() {
    const dispatch = useAppDispatch();
    const { status } = useSession();

    const wishlist = useAppSelector((state) => state.wishlist);

    const [isHydrated, setIsHydrated] = useState(false);

    // Wishlist: Hydrate from localStorage
    useEffect(() => {
        const storedWishlist =
            localStorage.getItem("lyra-wishlist");

        if (storedWishlist) {
            const parsedWishlist =
                JSON.parse(storedWishlist);

            dispatch(
                hydrateWishlist(
                    parsedWishlist.items ?? []
                )
            );
        }

        setIsHydrated(true);
    }, [dispatch]);

    // Wishlist: Sync to localStorage
    useEffect(() => {
        if (!isHydrated) return;

        localStorage.setItem(
            "lyra-wishlist",
            JSON.stringify(wishlist)
        );
    }, [wishlist, isHydrated]);

    // Cart: Prisma --> Redux store
    useEffect(() => {
        if (status === "loading") return;

        async function hydrateAuthenticatedCart() {
            const cart = await getCurrentCartAction();

            if (!cart) {
                dispatch(hydrateCart([]));
                return;
            }

            dispatch(hydrateCart(cart.items));
        }

        void hydrateAuthenticatedCart();
    }, [status, dispatch]);

    return null;
}