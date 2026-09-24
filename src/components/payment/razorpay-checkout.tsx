"use client";

import { useState } from "react";
import {
    createRazorpayOrderAction,
    verifyRazorpayPaymentAction,
    makeOrderPaymentFailedAction,
    getRazorpayPaymentStatusAction,
} from "@/lib/actions/payment.action";

type RazorpayCheckoutProps = {
    orderId: string;
};

export function RazorpayCheckout({
    orderId,
}: RazorpayCheckoutProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
    const [error, setError] = useState<string | null>(null);

    async function handlePayment() {
        if (isLoading || paymentStatus === "processing") return;

        setPaymentStatus("processing");
        setError(null);

        try {
            const razorpayOrder =
                await createRazorpayOrderAction(orderId);

            if (!window.Razorpay) {
                throw new Error(
                    "Razorpay Checkout failed to load"
                );
            }

            const options: RazorpayOptions = {
                key: process.env
                    .NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: Number(razorpayOrder.amount),
                currency: razorpayOrder.currency,
                name: "LYRA Fashion",
                description: "LYRA Fashion Order",
                order_id: razorpayOrder.razorpayOrderId,

                handler: async (response) => {
                    try {
                        const verifiedOrder = await verifyRazorpayPaymentAction({
                            orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        setPaymentStatus("success");

                        window.location.href = `/order-success?order=${verifiedOrder.orderNumber}`;
                    } catch (error) {
                        console.error("Payment verification failed: ", error);
                        alert(error instanceof Error ? error.message : "Payment verification failed");

                        setPaymentStatus("failed");
                        setError(error instanceof Error ? error.message : "Unable to start payment");
                    }
                },

                theme: {
                    color: "#111111",
                },

                modal: {
                    ondismiss: async () => {
                        try {
                            const result = await getRazorpayPaymentStatusAction(orderId);

                            const failedPayment = result.payments.find(
                                (payment) => payment.status === "failed"
                            );

                            if (failedPayment) {
                                await makeOrderPaymentFailedAction(orderId);
                            }
                        } catch (error) {
                            console.error("Failed to check payment status: ", error);
                        }
                    }
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                type="button"
                onClick={handlePayment}
                disabled={isLoading || paymentStatus === "processing"}
                className="bg-lyra-black px-6 py-3 text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {paymentStatus === "processing" ? "Processing..." : "Pay Now"}
            </button>
            {error && (
                <p className="mt-4 text-xs text-red-600">
                    {error}
                </p>
            )}
        </>
    );
}