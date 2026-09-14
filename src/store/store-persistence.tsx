"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "./hooks";
import { hydrateWishlist } from "./slices/wishlist/wishlistSlice";

export function StorePersistence() {
    const dispatch = useAppDispatch();

    const wishlist = useAppSelector((state) => state.wishlist);

    const [isHydrated, setIsHydrated] = useState(false);

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

    useEffect(() => {
        if (!isHydrated) return;

        localStorage.setItem(
            "lyra-wishlist",
            JSON.stringify(wishlist)
        );
    }, [wishlist, isHydrated]);

    return null;
}