import { prisma } from "@/lib/prisma";

export async function getAdminInventory() {
    return prisma.product.findMany({
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            sku: true,
            variants: {
                orderBy: {
                    size: "asc",
                },
                select: {
                    id: true,
                    size: true,
                    stock: true,
                },
            },
        },
    });
}