"use client";

import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlist/wishlistSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type ProductInfoProps = {
    productId: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    category: string;
    description: string;
    image: string;
};

export function ProductInfo({
    productId,
    name,
    slug,
    price,
    compareAtPrice,
    category,
    description,
    image,
}: ProductInfoProps) {
    const dispatch = useAppDispatch();

    const isWishlisted = useAppSelector((state) => state.wishlist.items.some((item) => item.productId === productId));

    function handleWishlistToggle() {
        if (isWishlisted) {
            dispatch(removeFromWishlist(productId));
            return;
        }

        dispatch(addToWishlist({
            productId,
            name,
            price,
            image,
            slug,
        }));
    };

    return (
        <>
            <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                    {category}
                </p>

                <div className="mt-4 flex items-start justify-between gap-6">
                    <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
                        {name}
                    </h1>

                    <button
                        type="button"
                        onClick={handleWishlistToggle}
                        aria-label={
                            isWishlisted
                                ? `Remove ${name} from wishlist`
                                : `Add ${name} to wishlist`
                        }
                        aria-pressed={isWishlisted}
                        className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center border border-lyra-border transition-all duration-300 hover:border-lyra-black"
                    >
                        <Heart
                            size={19}
                            strokeWidth={1.5}
                            fill={
                                isWishlisted
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>
                </div>

                <div className="mt-5 flex items-center gap3">
                    <span className="text-base">
                        ₹{price.toLocaleString("en-IN")}
                    </span>

                    {compareAtPrice && (
                        <span className="text-sm text-lyra-subtle line-through">
                            ₹{compareAtPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                <div className="mt-8 border-t border-lyra-border pt-8">
                    <p className="text-xs text-lyra-muted">
                        {description}
                    </p>
                </div>
            </div>
        </>
    );
}