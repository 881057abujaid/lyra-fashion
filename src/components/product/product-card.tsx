"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleWishlist } from "@/store/slices/wishlist/wishlistSlice";

type ProductCardProps = {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        compareAtPrice: number | null;
        category: string;
        images: string[];
        isNewArrival: boolean;
    };
};

export function ProductCard({
    product,
}: ProductCardProps) {
    const dispatch = useAppDispatch();

    const isWishlisted = useAppSelector((state) =>
        state.wishlist.items.some(
            (item) => item.productId === product.id
        )
    );

    function handleWishlistToggle() {
        dispatch(
            toggleWishlist({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? "",
                slug: product.slug,
            })
        );
    }

    return (
        <article className="group">
            <div className="relative">
                <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-3/4 overflow-hidden bg-lyra-beige">
                        {product.images[0] && (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                        )}

                        {product.isNewArrival && (
                            <span className="absolute left-4 top-4 bg-lyra-cream px-3 py-1.5 text-[10px] uppercase tracking-[0.16em]">
                                New
                            </span>
                        )}
                    </div>
                </Link>

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label={
                        isWishlisted
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                    }
                    aria-pressed={isWishlisted}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-lyra-cream/90 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                >
                    <Heart
                        size={17}
                        strokeWidth={1.5}
                        fill={isWishlisted ? "currentColor" : "none"}
                    />
                </button>
            </div>

            <Link href={`/products/${product.slug}`}>
                <div className="pt-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                        {product.category}
                    </p>

                    <h2 className="mt-2 font-display text-lg tracking-tight">
                        {product.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-3">
                        <span className="text-sm">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        {product.compareAtPrice && (
                            <span className="text-sm text-lyra-subtle line-through">
                                ₹
                                {product.compareAtPrice.toLocaleString(
                                    "en-IN"
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}