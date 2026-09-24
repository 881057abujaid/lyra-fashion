"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createOrderAction } from "@/lib/actions/order.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RazorpayCheckout } from "../payment/razorpay-checkout";

const CheckoutSchema = z.object({
    customerName: z
        .string()
        .trim()
        .min(2, "Please enter your full name"),

    customerEmail: z
        .string()
        .trim()
        .email("Please enter a valid email"),

    customerPhone: z
        .string()
        .trim()
        .regex(
            /^[6-9]\d{9}$/,
            "Please enter a valid 10-digit phone number"
        ),

    shippingAddress: z
        .string()
        .trim()
        .min(10, "Please enter your complete address"),

    shippingCity: z
        .string()
        .trim()
        .min(2, "Please enter your city"),

    shippingState: z
        .string()
        .trim()
        .min(2, "Please enter your state"),

    shippingPincode: z
        .string()
        .trim()
        .regex(
            /^\d{6}$/,
            "Please enter a valid 6-digit pincode"
        ),
});

type CheckoutFormData = z.infer<typeof CheckoutSchema>;

type FieldProps = {
    label: string;
    error?: string;
    children: React.ReactNode;
};

function Field({
    label,
    error,
    children,
}: FieldProps) {
    return (
        <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-lyra-muted">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-2 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClassName =
    "w-full border-b border-lyra-border bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black";

export function CheckoutForm() {
    const [orderId, setOrderId] =
        useState<string | null>(null);

    const [submitError, setSubmitError] =
        useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(CheckoutSchema),

        defaultValues: {
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            shippingAddress: "",
            shippingCity: "",
            shippingState: "",
            shippingPincode: "",
        },
    });

    async function onSubmit(
        data: CheckoutFormData
    ) {
        setSubmitError(null);

        try {
            const order =
                await createOrderAction(data);

            setOrderId(order.id);
        } catch (error) {
            console.error(
                "Order creation failed:",
                error
            );

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Unable to create your order. Please try again."
            );
        }
    }

    return (
        <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-10"
        >
            {/* Contact Information */}
            <section className="space-y-8">
                <div className="border-b border-lyra-border pb-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-lyra-muted">
                        01 — Contact Information
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2">
                    <Field
                        label="Full Name"
                        error={
                            errors.customerName?.message
                        }
                    >
                        <input
                            type="text"
                            placeholder="Your full name"
                            autoComplete="name"
                            {...register("customerName")}
                            className={inputClassName}
                        />
                    </Field>

                    <Field
                        label="Email Address"
                        error={
                            errors.customerEmail?.message
                        }
                    >
                        <input
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...register("customerEmail")}
                            className={inputClassName}
                        />
                    </Field>

                    <Field
                        label="Phone Number"
                        error={
                            errors.customerPhone?.message
                        }
                    >
                        <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="10-digit mobile number"
                            autoComplete="tel"
                            maxLength={10}
                            {...register("customerPhone")}
                            className={inputClassName}
                        />
                    </Field>
                </div>
            </section>

            {/* Shipping Address */}
            <section className="space-y-8">
                <div className="border-b border-lyra-border pb-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-lyra-muted">
                        02 — Shipping Address
                    </p>
                </div>

                <div className="space-y-8">
                    <Field
                        label="Address"
                        error={
                            errors.shippingAddress?.message
                        }
                    >
                        <textarea
                            rows={3}
                            placeholder="House / Flat / Street / Area"
                            autoComplete="street-address"
                            {...register("shippingAddress")}
                            className={`${inputClassName} resize-none`}
                        />
                    </Field>

                    <div className="grid gap-8 sm:grid-cols-2">
                        <Field
                            label="City"
                            error={
                                errors.shippingCity?.message
                            }
                        >
                            <input
                                type="text"
                                placeholder="Delhi"
                                autoComplete="address-level2"
                                {...register("shippingCity")}
                                className={inputClassName}
                            />
                        </Field>

                        <Field
                            label="State"
                            error={
                                errors.shippingState?.message
                            }
                        >
                            <input
                                type="text"
                                placeholder="Delhi"
                                autoComplete="address-level1"
                                {...register("shippingState")}
                                className={inputClassName}
                            />
                        </Field>
                    </div>

                    <Field
                        label="Pincode"
                        error={
                            errors.shippingPincode?.message
                        }
                    >
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="110001"
                            autoComplete="postal-code"
                            maxLength={6}
                            {...register("shippingPincode")}
                            className={inputClassName}
                        />
                    </Field>
                </div>
            </section>

            {/* Order Error */}
            {submitError && (
                <div className="border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs leading-5 text-red-600">
                        {submitError}
                    </p>
                </div>
            )}

            {/* Continue to Payment */}
            {!orderId && (
                <section className="border-t border-lyra-border pt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex min-h-14 w-full items-center justify-center bg-lyra-black px-6 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting
                            ? "Creating Order..."
                            : "Continue to Payment"}
                    </button>

                    <p className="mt-3 text-center text-[11px] leading-5 text-lyra-subtle">
                        Your order will be created securely
                        before payment.
                    </p>
                </section>
            )}

            {/* Payment */}
            {orderId && (
                <section className="border-t border-lyra-border pt-8">
                    <div className="mb-6">
                        <p className="text-xs uppercase tracking-[0.18em] text-lyra-muted">
                            03 — Payment
                        </p>

                        <p className="mt-2 text-sm text-lyra-muted">
                            Your order is ready. Complete
                            your payment securely with
                            Razorpay.
                        </p>
                    </div>

                    <div className="border border-lyra-border bg-lyra-white p-5 sm:p-6">
                        <div className="mb-5 flex items-center justify-between border-b border-lyra-border pb-4">
                            <span className="text-xs uppercase tracking-[0.14em] text-lyra-muted">
                                Order Created
                            </span>

                            <span className="text-xs uppercase tracking-[0.12em]">
                                Ready to Pay
                            </span>
                        </div>

                        <div className="flex min-h-14 w-full items-center justify-center">
                            <RazorpayCheckout
                                orderId={orderId}
                            />
                        </div>
                    </div>

                    <p className="mt-3 text-center text-[11px] leading-5 text-lyra-subtle">
                        Secure payment powered by Razorpay.
                    </p>
                </section>
            )}
        </form>
    );
}