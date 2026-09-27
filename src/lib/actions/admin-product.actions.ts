"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../auth/authorization";
import { prisma } from "../prisma";
import {
    CreateProductSchema,
    UpdateProductSchema,
    type CreateProductInput,
    type UpdateProductInput,
} from "@/validations/admin-product";

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

async function createUniqueSlug(
    name: string,
    productId?: string
) {
    const baseSlug = createSlug(name);

    let slug = baseSlug;
    let counter = 2;

    while (true) {
        const existingProduct = await prisma.product.findUnique({
            where: {
                slug,
            },
            select: {
                id: true,
            },
        });

        if (!existingProduct || existingProduct.id !== productId) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}

export async function createAdminProduct(
    input: CreateProductInput
) {
    await requireAdmin();

    const validatedData =
        CreateProductSchema.parse(input);

    const normalizedSku =
        validatedData.sku.toUpperCase();

    const existingSku =
        await prisma.product.findUnique({
            where: {
                sku: normalizedSku,
            },
            select: {
                id: true,
            },
        });

    if (existingSku) {
        throw new Error(
            "A product with this SKU already exists"
        );
    }

    const slug = await createUniqueSlug(
        validatedData.name
    );

    const product = await prisma.$transaction(
        async (tx) => {
            return tx.product.create({
                data: {
                    name: validatedData.name,
                    slug,
                    description: validatedData.description,
                    price: validatedData.price,
                    compareAtPrice:
                        validatedData.compareAtPrice,
                    sku: normalizedSku,
                    category: validatedData.category,
                    images: [],
                    isFeatured:
                        validatedData.isFeatured,
                    isNewArrival:
                        validatedData.isNewArrival,

                    variants: {
                        create: validatedData.variants.map(
                            (variant) => ({
                                size: variant.size
                                    .trim()
                                    .toUpperCase(),
                                stock: variant.stock,
                            })
                        ),
                    },
                },

                include: {
                    variants: true,
                },
            });
        }
    );

    revalidatePath("/admin/products");
    revalidatePath("/");

    return product;
}

export async function updateAdminProduct(
    productId: string,
    input: UpdateProductInput,
) {
    await requireAdmin();

    const validatedData = UpdateProductSchema.parse(input);

    const existingProduct = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            sku: true,
            variants: {
                select: {
                    id: true,
                    size: true,
                },
            },
        },
    });

    if (!existingProduct) {
        throw new Error("Product not found");
    }

    const normalizedSku = validatedData.sku.toUpperCase();

    const existingSku = await prisma.product.findFirst({
        where: {
            sku: normalizedSku,
            NOT: {
                id: productId,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingSku) {
        throw new Error("A product with this SKU already exists");
    }

    const normalizedVariants = validatedData.variants.map((variant) => ({
        ...variant,
        size: variant.size.trim().toUpperCase(),
    }));

    const submittedVariantIds = new Set(
        normalizedVariants
            .map((variant) => variant.id)
            .filter((id): id is string => Boolean(id)),
    );

    const variantsToRemove = existingProduct.variants.filter(
        (variant) => !submittedVariantIds.has(variant.id),
    );

    const product = await prisma.$transaction(async (tx) => {
        /*
         * 1. Update product information
         */
        await tx.product.update({
            where: {
                id: productId,
            },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                compareAtPrice: validatedData.compareAtPrice,
                sku: normalizedSku,
                category: validatedData.category,
                isFeatured: validatedData.isFeatured,
                isNewArrival: validatedData.isNewArrival,
            },
        });

        /*
         * 2. Update existing variants / create new variants
         */
        for (const variant of normalizedVariants) {
            if (variant.id) {
                const existingVariant = existingProduct.variants.find(
                    (item) => item.id === variant.id,
                );

                if (!existingVariant) {
                    throw new Error("Invalid product variant");
                }

                await tx.productVariant.update({
                    where: {
                        id: variant.id,
                    },
                    data: {
                        size: variant.size,
                        stock: variant.stock,
                    },
                });
            } else {
                await tx.productVariant.create({
                    data: {
                        productId,
                        size: variant.size,
                        stock: variant.stock,
                    },
                });
            }
        }

        /*
         * 3. Handle removed variants safely
         */
        for (const variant of variantsToRemove) {
            const cartItemCount = await tx.cartItem.count({
                where: {
                    variantId: variant.id,
                },
            });

            if (cartItemCount > 0) {
                await tx.productVariant.update({
                    where: {
                        id: variant.id,
                    },
                    data: {
                        stock: 0,
                    },
                });
            } else {
                await tx.productVariant.delete({
                    where: {
                        id: variant.id,
                    },
                });
            }
        }

        /*
         * 4. Return updated product
         */
        return tx.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                variants: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath(`/products/${productId}`);
    revalidatePath("/");

    return product;
}