import { prisma } from "../prisma";

export async function getProducts() {
    return prisma.product.findMany({
        include: {
            variants: true,
        },
        orderBy: {
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