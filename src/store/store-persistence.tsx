"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "./hooks";
import { hydrateCart } from "./slices/cart/cartSlice";
import { hydrateWishlist } from "./slices/wishlist/wishlistSlice";

export function StorePersistence() {
    const dispatch = useAppDispatch();

    const cart = useAppSelector((state) => state.cart);
    const wishlist = useAppSelector((state) => state.wishlist);

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem("lyra-cart");
        const storedWishlist =
            localStorage.getItem("lyra-wishlist");

        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);

            dispatch(
                hydrateCart(parsedCart.items ?? [])
            );
        }

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
            "lyra-cart",
            JSON.stringify(cart)
        );

        localStorage.setItem(
            "lyra-wishlist",
            JSON.stringify(wishlist)
        );
    }, [cart, wishlist, isHydrated]);

    return null;
}