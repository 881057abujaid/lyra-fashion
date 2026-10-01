"use server";

import { z } from "zod";

import { requireAdmin } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";

const updateInventoryStockSchema = z.object({
    variantId: z.string().min(1, "Variant ID is required."),
    stock: z
        .number()
        .int("Stock must be a whole number.")
        .min(0, "Stock cannot be negative."),
});

export async function updateInventoryStockAction(
    input: z.infer<typeof updateInventoryStockSchema>,
) {
    await requireAdmin();

    const parsed = updateInventoryStockSchema.safeParse(input);

    if (!parsed.success) {
        throw new Error(
            parsed.error.issues[0]?.message ?? "Invalid stock value.",
        );
    }

    const variant = await prisma.productVariant.findUnique({
        where: {
            id: parsed.data.variantId,
        },
        select: {
            id: true,
        },
    });

    if (!variant) {
        throw new Error("Product variant not found.");
    }

    await prisma.productVariant.update({
        where: {
            id: parsed.data.variantId,
        },
        data: {
            stock: parsed.data.stock,
        },
    });

    return {
        success: true,
    };
}