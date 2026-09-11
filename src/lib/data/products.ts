import { prisma } from "../prisma";

type GetproductsOption = {
    category?: string;
    sort?: "featured" | "newest" | "price-low" | "price-high";
};

export async function getProducts(options: GetproductsOption = {}) {
    const { category, sort = "newest" } = options;

    return prisma.product.findMany({
        where: category ? {
            category,
        } : undefined,

        include: {
            variants: true,
        },
        orderBy: sort === "price-low" ? {
            price: "asc",
        } : sort === "price-high" ? {
            price: "desc",
        } : sort === "featured" ? {
            isFeatured: "desc",
        } : {
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