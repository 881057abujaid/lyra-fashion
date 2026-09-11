import Image from "next/image";
import Link from "next/link";

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

export function ProductCard({ product, }: ProductCardProps) {
    return (
        <article className="group">
            <Link href={`/products/${product.slug}`}>
                {/* Image */}
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
                        <span className="absolute left-4 top-4 bg-lyra-cream px-3 py-1.5 text-[1-px] uppercase tracking-[0.16em]">
                            New
                        </span>
                    )}
                </div>

                {/* Product Information */}
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
                                ₹{product.compareAtPrice.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}