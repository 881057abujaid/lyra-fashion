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

export async function getNewArrivalProducts(limit = 4) {
    const products = await prisma.product.findMany({
        where: {
            isNewArrival: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: limit,
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            price: true,
            compareAtPrice: true,
            category: true,
            images: productImages,
            isNewArrival: true,
        },
    });

    return products.map(mapProductImages);
}

export async function getBestSellingProducts(limit = 4) {
    const bestSellers = await prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
            order: {
                paymentStatus: "PAID",
            },
        },
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: "desc",
            },
        },
        take: limit,
    });

    if (bestSellers.length === 0) {
        return [];
    }

    const productIds = bestSellers.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            compareAtPrice: true,
            category: true,
            isNewArrival: true,
            images: productImages,
        },
    });

    const productMap = new Map(
        products.map((product) => [product.id, product]),
    );

    return bestSellers
        .map((item) => productMap.get(item.productId))
        .filter(
            (
                product,
            ): product is NonNullable<typeof product> =>
                Boolean(product),
        )
        .map(mapProductImages);
}