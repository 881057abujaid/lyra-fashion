"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "../auth/authorization";
import { prisma } from "../prisma";
import {
    CreateProductSchema,
    type CreateProductInput,
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