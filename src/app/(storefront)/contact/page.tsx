export default function ContactPage() {
    return (
        <main className="bg-lyra-white">
            {/* Hero */}
            <section className="border-b border-lyra-border px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-xs uppercase tracking-[0.25em] text-lyra-muted">
                        Contact
                    </p>

                    <h1 className="mt-5 font-display text-4xl leading-tight tracking-tight text-lyra-black md:text-6xl">
                        We would love to hear from you.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-lyra-muted">
                        Questions about an order, a product, or anything else?
                        Reach out to the LYRA team.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="grid border border-lyra-border md:grid-cols-2">
                        <div className="border-b border-lyra-border p-8 md:border-b-0 md:border-r md:p-10">
                            <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                                Customer Care
                            </p>

                            <h2 className="mt-4 font-display text-3xl tracking-tight text-lyra-black">
                                Need help with an order?
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-lyra-muted">
                                Keep your order number available when contacting
                                us about an existing order. This helps us find
                                the relevant order details quickly.
                            </p>

                            <div className="mt-8 border-t border-lyra-border pt-6">
                                <p className="text-xs uppercase tracking-wider text-lyra-muted">
                                    Email
                                </p>

                                <p className="mt-2 text-sm text-lyra-black">
                                    support@lyrafashion.com
                                </p>
                            </div>
                        </div>

                        <div className="p-8 md:p-10">
                            <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                                Before You Contact Us
                            </p>

                            <h2 className="mt-4 font-display text-3xl tracking-tight text-lyra-black">
                                Have your details ready.
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-lyra-muted">
                                <p>
                                    For order-related questions, include your
                                    order number and the email address used
                                    during checkout.
                                </p>

                                <p>
                                    For product questions, mention the product
                                    name or SKU where possible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Account Support */}
            <section className="border-y border-lyra-border bg-lyra-cream px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                            Your Account
                        </p>

                        <h2 className="mt-4 font-display text-3xl tracking-tight text-lyra-black md:text-4xl">
                            Manage your orders from your account.
                        </h2>
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-lyra-muted">
                        <p>
                            Signed-in customers can review their orders and
                            current order status from their LYRA account.
                        </p>

                        <p>
                            For general order information, checking your
                            account first can help you find the details you
                            need quickly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-lyra-muted">
                        LYRA
                    </p>

                    <h2 className="mt-4 font-display text-3xl tracking-tight text-lyra-black md:text-4xl">
                        Thoughtful fashion, thoughtful service.
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-lyra-muted">
                        We are here to help make your LYRA experience as
                        seamless as possible.
                    </p>
                </div>
            </section>
        </main>
    );
}