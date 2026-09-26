import { z } from "zod";

/**
 * Converts form values into a nullable number.
 *
 * HTML inputs usually submit values as strings.
 * Empty compare-at price should become null.
 */
const optionalPriceSchema = z.preprocess(
    (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return Number(value);
    },
    z
        .number({
            error: "Compare-at price must be a valid number",
        })
        .int("Compare-at price must be a whole number")
        .positive("Compare-at price must be greater than 0")
        .nullable()
);

/**
 * Product variant validation.
 */
const ProductVariantSchema = z.object({
    size: z
        .string()
        .trim()
        .min(1, "Size is required")
        .max(20, "Size is too long"),

    stock: z.preprocess(
        (value) => Number(value),
        z
            .number({
                error: "Stock must be a valid number",
            })
            .int("Stock must be a whole number")
            .min(0, "Stock cannot be negative")
    ),
});

/**
 * Product creation validation schema.
 */
export const CreateProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(
                2,
                "Product name must be at least 2 characters"
            )
            .max(120, "Product name is too long"),

        description: z
            .string()
            .trim()
            .min(
                10,
                "Product description must be at least 10 characters"
            ),

        price: z.preprocess(
            (value) => Number(value),
            z
                .number({
                    error: "Price must be a valid number",
                })
                .int("Price must be a whole number")
                .positive(
                    "Price must be greater than 0"
                )
        ),

        compareAtPrice: optionalPriceSchema,

        sku: z
            .string()
            .trim()
            .min(2, "SKU is required")
            .max(50, "SKU is too long"),

        category: z
            .string()
            .trim()
            .min(2, "Category is required")
            .max(50, "Category is too long"),

        isFeatured: z.boolean(),

        isNewArrival: z.boolean(),

        variants: z
            .array(ProductVariantSchema)
            .min(
                1,
                "At least one product variant is required"
            ),
    })
    .superRefine((data, ctx) => {
        /**
         * Compare-at price must be greater than
         * the actual selling price.
         */
        if (
            data.compareAtPrice !== null &&
            data.compareAtPrice <= data.price
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["compareAtPrice"],
                message:
                    "Compare-at price must be greater than the selling price",
            });
        }

        /**
         * Prevent duplicate sizes.
         *
         * Example:
         * S
         * M
         * S
         *
         * → invalid
         */
        const normalizedSizes = data.variants.map(
            (variant) => variant.size.trim().toLowerCase()
        );

        const duplicateSizes = normalizedSizes.filter(
            (size, index) =>
                normalizedSizes.indexOf(size) !== index
        );

        if (duplicateSizes.length > 0) {
            ctx.addIssue({
                code: "custom",
                path: ["variants"],
                message:
                    "Each product size must be unique",
            });
        }
    });

export type CreateProductInput = z.infer<
    typeof CreateProductSchema
>;