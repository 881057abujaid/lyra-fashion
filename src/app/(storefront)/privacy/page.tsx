export default function PrivacyPage() {
    return (
        <main className="bg-white">
            {/* Hero */}
            <section className="border-b border-neutral-200 px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                        Privacy
                    </p>

                    <h1 className="mt-5 font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
                        Your privacy matters.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
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
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                01
                            </p>

                            <h2 className="mt-3 font-serif text-3xl text-neutral-900">
                                Information we collect
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-neutral-600">
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
                        <section className="border-t border-neutral-200 pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                02
                            </p>

                            <h2 className="mt-3 font-serif text-3xl text-neutral-900">
                                How we use information
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-neutral-600">
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
                        <section className="border-t border-neutral-200 pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                03
                            </p>

                            <h2 className="mt-3 font-serif text-3xl text-neutral-900">
                                Payments
                            </h2>

                            <div className="mt-5 text-sm leading-7 text-neutral-600">
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
                        <section className="border-t border-neutral-200 pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                04
                            </p>

                            <h2 className="mt-3 font-serif text-3xl text-neutral-900">
                                Data security
                            </h2>

                            <div className="mt-5 text-sm leading-7 text-neutral-600">
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
                        <section className="border-t border-neutral-200 pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                05
                            </p>

                            <h2 className="mt-3 font-serif text-3xl text-neutral-900">
                                Cookies and similar technologies
                            </h2>

                            <div className="mt-5 text-sm leading-7 text-neutral-600">
                                <p>
                                    LYRA may use cookies or similar
                                    technologies where necessary to support
                                    functionality, authentication, preferences,
                                    and the operation of the store.
                                </p>
                            </div>
                        </section>

                        {/* Your choices */}
                        <section className="border-t border-neutral-200 pt-12">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                06
                            </p>

                            <h2 className="mt-3 font-serif text-3xl text-neutral-900">
                                Your information
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-neutral-600">
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
            <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        LYRA
                    </p>

                    <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                        Transparency, by design.
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-600">
                        We aim to keep our approach to customer information
                        clear and understandable.
                    </p>
                </div>
            </section>
        </main>
    );
}