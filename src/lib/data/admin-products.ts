import { prisma } from "../prisma";

const LOW_STOCK_THRESHOLD = 5;

export type AdminProductFilters = {
    search?: string;
    category?: string;
    stock?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
};

export type AdminProduct = {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    compareAtPrice: number | null;
    category: string;
    images: string[];
    isFeatured: boolean;
    isNewArrival: boolean;
    createdAt: Date;
    variants: {
        id: string;
        size: string;
        stock: number;
    }[];
};

export type AdminProductsResult = {
    products: AdminProduct[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
};

function buildProductWhere(filters: AdminProductFilters = {}) {
    const search = filters.search?.trim();

    return {
        ...(search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        sku: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),
        ...(filters.category
            ? {
                category: filters.category,
            }
            : {}),
        ...(filters.stock === "OUT_OF_STOCK"
            ? {
                variants: {
                    every: {
                        stock: {
                            lte: 0,
                        },
                    },
                },
            }
            : {}),
        ...(filters.stock === "IN_STOCK"
            ? {
                variants: {
                    some: {
                        stock: {
                            gt: 0,
                        },
                    },
                },
            }
            : {}),
        ...(filters.stock === "LOW_STOCK"
            ? {
                variants: {
                    some: {
                        stock: {
                            gt: 0,
                            lte: LOW_STOCK_THRESHOLD,
                        },
                    },
                },
            }
            : {}),
    };
}

export async function getAdminProducts(
    filters: AdminProductFilters = {},
    page = 1,
    pageSize = 20
): Promise<AdminProductsResult> {
    const where = buildProductWhere(filters);

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip: (safePage - 1) * safePageSize,
            take: safePageSize,
            select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                price: true,
                compareAtPrice: true,
                category: true,
                images: true,
                isFeatured: true,
                isNewArrival: true,
                createdAt: true,
                variants: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    select: {
                        id: true,
                        size: true,
                        stock: true,
                    },
                },
            },
        }),
        prisma.product.count({
            where,
        }),
    ]);

    return {
        products,
        total,
        page: safePage,
        pageSize: safePageSize,
        totalPages: Math.ceil(total / safePageSize),
    };
}

export async function getAdminProductCategories() {
    const products = await prisma.product.findMany({
        distinct: ["category"],
        orderBy: {
            category: "asc"
        },
        select: {
            category: true,
        },
    });

    return products.map((product) => product.category);
}