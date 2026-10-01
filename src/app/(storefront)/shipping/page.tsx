export default function ShippingPage() {
    return (
        <main className="bg-white">
            {/* Hero */}
            <section className="border-b border-neutral-200 px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                        Shipping
                    </p>

                    <h1 className="mt-5 font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
                        Delivery, made simple.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
                        Everything you need to know about receiving your LYRA
                        order.
                    </p>
                </div>
            </section>

            {/* Shipping Information */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="grid border border-neutral-200 md:grid-cols-2">
                        <div className="border-b border-neutral-200 p-8 md:border-b-0 md:border-r md:p-10">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Shipping Coverage
                            </p>

                            <h2 className="mt-4 font-serif text-3xl text-neutral-900">
                                Where we deliver
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-neutral-600">
                                LYRA orders are delivered to the shipping
                                address provided during checkout.
                            </p>
                        </div>

                        <div className="p-8 md:p-10">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Shipping Charges
                            </p>

                            <h2 className="mt-4 font-serif text-3xl text-neutral-900">
                                Free shipping above ₹1,499
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-neutral-600">
                                Orders above ₹1,499 qualify for free shipping,
                                as reflected in the LYRA store.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Order Tracking */}
            <section className="border-y border-neutral-200 bg-neutral-50 px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Order Tracking
                        </p>

                        <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                            Stay updated on your order.
                        </h2>
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-neutral-600">
                        <p>
                            Once your order has been processed, relevant order
                            information will be available through your LYRA
                            account.
                        </p>

                        <p>
                            You can also review your orders and their current
                            status from your account order history.
                        </p>
                    </div>
                </div>
            </section>

            {/* Important Information */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Important
                    </p>

                    <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                        Please check your shipping details carefully.
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-600">
                        Please make sure your name, phone number, address,
                        city, state, and pincode are correct before completing
                        your order.
                    </p>
                </div>
            </section>
        </main>
    );
}