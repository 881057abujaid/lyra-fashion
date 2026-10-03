import Image from "next/image";
import Link from "next/link";

import { getProductCategories } from "@/lib/data/products";

function formatCategoryName(category: string) {
    return category
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function CollectionsPage() {
    const categories = await getProductCategories();

    return (
        <main className="px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        The LYRA Edit
                    </p>

                    <h1 className="mt-2 font-display text-4xl tracking-tight text-lyra-black sm:text-5xl">
                        Collections
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-lyra-muted">
                        Explore the LYRA wardrobe through thoughtfully curated
                        categories designed for effortless everyday elegance.
                    </p>
                </div>

                {/* Collection Grid */}
                {categories.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map(({ category, image }) => (
                            <Link
                                key={category}
                                href={`/shop?category=${encodeURIComponent(category)}`}
                                className="group block"
                            >
                                <div className="relative aspect-4/5 overflow-hidden bg-lyra-beige">
                                    {image ? (
                                        <Image
                                            src={image.url}
                                            alt={
                                                image.alt ??
                                                `${formatCategoryName(category)} collection`
                                            }
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-[10px] uppercase tracking-[0.16em] text-lyra-muted">
                                                No Image
                                            </span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/45 via-black/10 to-transparent px-6 pb-6 pt-16">
                                        <div className="flex items-end justify-between gap-4">
                                            <h2 className="font-display text-2xl text-lyra-white sm:text-3xl">
                                                {formatCategoryName(category)}
                                            </h2>

                                            <span className="shrink-0 border-b border-white pb-1 text-[10px] uppercase tracking-[0.14em] text-lyra-white">
                                                Explore
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="border border-dashed border-lyra-border px-6 py-20 text-center">
                        <p className="font-display text-xl text-lyra-black">
                            No collections yet
                        </p>

                        <p className="mt-2 text-sm text-lyra-muted">
                            Product categories will appear here once products
                            are added to the store.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}