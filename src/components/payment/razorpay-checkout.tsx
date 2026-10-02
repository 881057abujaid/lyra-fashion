"use client";

import { useState, useRef } from "react";
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

    // Guards against race conditions, duplicate submissions, and stale state in async handlers
    const isSubmittingRef = useRef(false);
    const isSuccessOrVerifyingRef = useRef(false);
    const hasRecordedFailureRef = useRef(false);
    const lastFailedPaymentErrorRef = useRef<string | null>(null);

    async function handlePayment() {
        if (isSubmittingRef.current || isLoading || paymentStatus === "processing" || paymentStatus === "success") {
            return;
        }

        isSubmittingRef.current = true;
        setIsLoading(true);
        setPaymentStatus("processing");
        setError(null);
        hasRecordedFailureRef.current = false;
        lastFailedPaymentErrorRef.current = null;
        isSuccessOrVerifyingRef.current = false;

        try {
            const razorpayOrder = await createRazorpayOrderAction(orderId);

            if (!window.Razorpay) {
                throw new Error("Razorpay Checkout failed to load. Please refresh and try again.");
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: Number(razorpayOrder.amount),
                currency: razorpayOrder.currency,
                name: "LYRA Fashion",
                description: "LYRA Fashion Order",
                order_id: razorpayOrder.razorpayOrderId,

                handler: async (response) => {
                    // Mark verification as in-flight so ondismiss does not treat modal close as dismissal
                    isSuccessOrVerifyingRef.current = true;
                    setPaymentStatus("processing");
                    setError(null);

                    try {
                        const verifiedOrder = await verifyRazorpayPaymentAction({
                            orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (!verifiedOrder) {
                            throw new Error("Payment was verified, but the order could not be found");
                        }

                        setPaymentStatus("success");
                        window.location.href = `/order-success?order=${verifiedOrder.orderNumber}`;
                    } catch (err) {
                        console.error("Payment verification failed: ", err);

                        // Verification failed: do NOT call makeOrderPaymentFailedAction().
                        // The customer may have been charged; releasing stock blindly must be avoided.
                        isSuccessOrVerifyingRef.current = false;
                        isSubmittingRef.current = false;
                        setPaymentStatus("failed");
                        setError(
                            err instanceof Error
                                ? `${err.message}. If money was deducted, please contact support before retrying.`
                                : "Payment verification failed. If money was deducted, please contact support before retrying."
                        );
                    }
                },

                theme: {
                    color: "#111111",
                },

                modal: {
                    ondismiss: async () => {
                        // If payment was captured or verification is in-flight, ignore modal close
                        if (isSuccessOrVerifyingRef.current) {
                            return;
                        }

                        try {
                            const result = await getRazorpayPaymentStatusAction(orderId);

                            const failedPayment = result.payments.find(
                                (payment) => payment.status === "failed"
                            );

                            if (failedPayment || hasRecordedFailureRef.current) {
                                // Actual payment failure reported by Razorpay
                                await makeOrderPaymentFailedAction(orderId);
                                setPaymentStatus("failed");
                                setError(
                                    failedPayment?.error_description ||
                                    lastFailedPaymentErrorRef.current ||
                                    "Payment failed.Please place a new order to try again."
                                );
                            } else {
                                // User simply closed the modal without attempting or failing payment.
                                // Do NOT mark order as FAILED/CANCELLED.
                                setPaymentStatus("idle");
                                setError(null);
                            }
                        } catch (err) {
                            console.error("Failed to check payment status on dismiss: ", err);
                            // On network/status check failure, do not blindly fail the order
                            setPaymentStatus("idle");
                            setError("Payment was cancelled or closed. You can try again.");
                        } finally {
                            setIsLoading(false);
                            isSubmittingRef.current = false;
                        }
                    },
                },
            };

            const razorpay = new window.Razorpay(options);

            // Register client-side payment failure handler if supported
            if (typeof razorpay.on === "function") {
                razorpay.on("payment.failed", (response: { error?: { description?: string } }) => {
                    hasRecordedFailureRef.current = true;
                    if (response?.error?.description) {
                        lastFailedPaymentErrorRef.current = response.error.description;
                    }
                });
            }

            razorpay.open();
        } catch (err) {
            console.error("Payment initiation failed: ", err);
            setPaymentStatus("idle");
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to initiate payment. Please try again."
            );
            isSubmittingRef.current = false;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={handlePayment}
                disabled={
                    isLoading ||
                    paymentStatus === "processing" ||
                    paymentStatus === "success" ||
                    paymentStatus === "failed"
                }
                className="bg-lyra-black px-6 py-3 text-xs uppercase tracking-[0.16em] text-lyra-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {paymentStatus === "processing"
                    ? "Processing..."
                    : paymentStatus === "success"
                        ? "Redirecting..."
                        : paymentStatus === "failed"
                            ? "Payment Failed"
                            : "Pay Now"}
            </button>
            {error && (
                <p className="mt-4 text-center text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}