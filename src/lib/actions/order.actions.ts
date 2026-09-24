"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createOrderFromCart } from "@/lib/data/orders";

const CreateOrderSchema = z.object({
    customerName: z.string().trim().min(2, "Please enter your full name."),
    customerEmail: z.string().trim().email("Please enter a valid email"),
    customerPhone: z.string().trim().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
    shippingAddress: z.string().trim().min(10, "Please enter your city"),
    shippingCity: z.string().trim().min(2, "Please  enter your city"),
    shippingState: z.string().trim().min(2, "Please enter your state"),
    shippingPincode: z.string().trim().regex(/^\d{6}$/, "Please enter a valid 6-digit pincode"),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export async function createOrderAction(input: CreateOrderInput) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be signed in to place an order");
    }

    const validatedData = CreateOrderSchema.parse(input);

    return createOrderFromCart(session.user.id, validatedData);
}