import { removeFromWishlist, type WishlistItem } from "@/store/slices/wishlist/wishlistSlice";
import { useAppDispatch } from "@/store/hooks";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X } from "lucide-react";

type WishlistCardProps = {
    item: WishlistItem;
};

export function WishlistCard({ item }: WishlistCardProps) {
    const dispatch = useAppDispatch();

    return (
        <article className="group">
            <div className="relative">
                <Link href={`products/${item.slug}`}>
                    <div className="relative aspect-3/4 overflow-hidden bg-lyra-beige">
                        {item.image && (
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 300px"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                        )}
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={() => dispatch(removeFromWishlist(item.productId))}
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-lyra-cream/90 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                >
                    <X size={17} strokeWidth={1.5} />
                </button>
            </div>

            <div className="pt-4">
                <h2 className="font-display text-lg tracking-tight">
                    {item.name}
                </h2>

                <p className="mt-2 text-sm">
                    ₹{item.price.toLocaleString("en-IN")}
                </p>

                <Link
                    href={`/products/${item.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-lyra-muted transition-colors hover:text-lyra-black"
                >
                    <ShoppingBag
                        size={14}
                        strokeWidth={1.5}
                    />
                    View Product
                </Link>
            </div>
        </article>
    );
}