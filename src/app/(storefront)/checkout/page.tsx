import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentCart } from "@/lib/data/cart-view";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";

export default async function CheckoutPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/checkout");
    }

    const cart = await getCurrentCart();

    if (!cart || cart.items.length === 0) {
        redirect("/cart")
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted">
                    Checkout
                </p>

                <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
                    Complete your purchase
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-lyra-muted">
                    Enter your details and review your order before placing it.
                </p>
            </div>

            <div className="grid gap-16 lg:grid-cols-[1fr_420px]">
                <section>
                    <div className="border-b border-lyra-border pb-8">
                        <p className="text-xs uppercase tracking-[0.18em]">
                            Contact Information
                        </p>
                    </div>

                    <div className="mt-8">
                        <CheckoutForm />
                    </div>
                </section>

                <aside>
                    <div className="borde-b border-lyra-border pb-8">
                        <p className="text-xs uppercase tracking-[0.18em]">
                            Your Order
                        </p>
                    </div>

                    <div className="mt-8">
                        <OrderSummary />
                    </div>
                </aside>
            </div>
        </main>
    );
}