export default function PrivacyPage() {
    return (
        <main className="bg-lyra-white">
            {/* Hero */}
            <section className="border-b border-lyra-border px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-lyra-muted">
                        Privacy
                    </p>

                    <h1 className="mt-5 font-display text-4xl leading-tight text-lyra-black md:text-6xl">
                        Your privacy matters.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-lyra-muted">
                        This page explains how LYRA may collect and use
                        information when you use our store.
                    </p>
                </div>
            </section>

            {/* Policy */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-4xl">
                    <div className="space-y-12">
                        {/* Introduction */}
                        <section>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                                01
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-lyra-black">
                                Information we collect
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-lyra-muted">
                                <p>
                                    When you create an account, place an order,
                                    or interact with LYRA, we may collect
                                    information needed to provide our services.
                                </p>

                                <p>
                                    This may include information such as your
                                    name, email address, phone number, shipping
                                    address, and order information.
                                </p>
                            </div>
                        </section>

                        {/* Use */}
                        <section className="border-t border-lyra-border pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                                02
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-lyra-black">
                                How we use information
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-lyra-muted">
                                <p>
                                    Information may be used to process orders,
                                    provide customer support, maintain your
                                    account, and communicate with you about
                                    relevant order activity.
                                </p>

                                <p>
                                    We may also use information to maintain,
                                    secure, and improve the LYRA shopping
                                    experience.
                                </p>
                            </div>
                        </section>

                        {/* Payments */}
                        <section className="border-t border-lyra-border pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                                03
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-lyra-black">
                                Payments
                            </h2>

                            <div className="mt-5 text-sm leading-7 text-lyra-muted">
                                <p>
                                    Payment processing is handled through the
                                    payment services integrated with LYRA.
                                    Payment information is processed according
                                    to the applicable policies of those
                                    providers.
                                </p>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="border-t border-lyra-border pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                                04
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-lyra-black">
                                Data security
                            </h2>

                            <div className="mt-5 text-sm leading-7 text-lyra-muted">
                                <p>
                                    We take reasonable measures to protect
                                    information associated with your LYRA
                                    account and orders. No method of
                                    transmission or storage can be guaranteed
                                    to be completely secure.
                                </p>
                            </div>
                        </section>

                        {/* Cookies */}
                        <section className="border-t border-lyra-border pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                                05
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-lyra-black">
                                Cookies and similar technologies
                            </h2>

                            <div className="mt-5 text-sm leading-7 text-lyra-muted">
                                <p>
                                    LYRA may use cookies or similar
                                    technologies where necessary to support
                                    functionality, authentication, preferences,
                                    and the operation of the store.
                                </p>
                            </div>
                        </section>

                        {/* Your choices */}
                        <section className="border-t border-lyra-border pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                                06
                            </p>

                            <h2 className="mt-3 font-display text-3xl text-lyra-black">
                                Your information
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-lyra-muted">
                                <p>
                                    If you have questions about information
                                    associated with your LYRA account or need
                                    assistance with your personal information,
                                    please contact LYRA customer care.
                                </p>

                                <p>
                                    Additional rights and requirements may
                                    apply depending on applicable law and the
                                    location of the customer.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="border-t border-lyra-border bg-lyra-cream px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-lyra-muted">
                        LYRA
                    </p>

                    <h2 className="mt-4 font-display text-3xl text-lyra-black md:text-4xl">
                        Transparency, by design.
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-lyra-muted">
                        We aim to keep our approach to customer information
                        clear and understandable.
                    </p>
                </div>
            </section>
        </main>
    );
}