import { prisma } from "../prisma";

type GetproductsOption = {
    search?: string;
    category?: string;
    sort?: "featured" | "newest" | "price-low" | "price-high";
};

const productImages = {
    orderBy: {
        sortOrder: "asc" as const,
    },
    select: {
        url: true,
        alt: true,
    },
};

function mapProductImages<
    T extends {
        images: {
            url: string;
            alt: string | null;
        }[];
    },
>(product: T) {
    return {
        ...product,
        images: product.images.map((image) => ({
            url: image.url,
            alt: image.alt,
        })),
    };
}

export async function getProducts(options: GetproductsOption = {}) {
    const { search, category, sort = "newest" } = options;

    const products = await prisma.product.findMany({
        where: {
            ...(category
                ? {
                    category,
                }
                : {}),
            ...(search
                ? {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            category: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },
        include: {
            images: productImages,
            variants: true,
        },
        orderBy:
            sort === "price-low"
                ? {
                    price: "asc",
                }
                : sort === "price-high"
                    ? {
                        price: "desc",
                    }
                    : sort === "featured"
                        ? {
                            isFeatured: "desc",
                        }
                        : {
                            createdAt: "desc",
                        },
    });

    return products.map(mapProductImages);
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            images: productImages,
            variants: true,
        },
    });

    if (!product) {
        return null;
    }

    return mapProductImages(product);
}

export async function getRelatedProducts(
    productId: string,
    category: string
) {
    const sameCategoryProducts = await prisma.product.findMany({
        where: {
            category,
            id: {
                not: productId,
            },
        },
        include: {
            images: productImages,
            variants: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 4,
    });

    const mappedSameCategoryProducts =
        sameCategoryProducts.map(mapProductImages);

    if (mappedSameCategoryProducts.length >= 4) {
        return mappedSameCategoryProducts;
    }

    const remainingProducts = await prisma.product.findMany({
        where: {
            id: {
                not: productId,
            },
            category: {
                not: category,
            },
        },
        include: {
            images: productImages,
            variants: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 4 - mappedSameCategoryProducts.length,
    });

    const mappedRemainingProducts =
        remainingProducts.map(mapProductImages);

    return [
        ...mappedSameCategoryProducts,
        ...mappedRemainingProducts,
    ];
}