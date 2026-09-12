import { prisma } from "../prisma";

type GetproductsOption = {
    search?: string;
    category?: string;
    sort?: "featured" | "newest" | "price-low" | "price-high";
};

export async function getProducts(options: GetproductsOption = {}) {
    const { search, category, sort = "newest" } = options;

    return prisma.product.findMany({
        where: {
            ...(category
                ? {
                    category,
                }
                : {}
            ),
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
                : {}
            ),
        },
        include: {
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
}

export async function getProductBySlug(slug: string) {
    return prisma.product.findUnique({
        where: {
            slug,
        },
        include: {
            variants: true,
        },
    });
}