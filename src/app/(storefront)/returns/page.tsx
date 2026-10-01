export default function ReturnsPage() {
    return (
        <main className="bg-white">
            {/* Hero */}
            <section className="border-b border-neutral-200 px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                        Returns
                    </p>

                    <h1 className="mt-5 font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
                        A simple return experience.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
                        Information about returning your LYRA order and getting
                        the support you need.
                    </p>
                </div>
            </section>

            {/* Return Overview */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="grid border border-neutral-200 md:grid-cols-2">
                        <div className="border-b border-neutral-200 p-8 md:border-b-0 md:border-r md:p-10">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Before You Return
                            </p>

                            <h2 className="mt-4 font-serif text-3xl text-neutral-900">
                                Check your order details
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-neutral-600">
                                Before requesting a return, review your order
                                information and make sure the item meets the
                                applicable return requirements.
                            </p>
                        </div>

                        <div className="p-8 md:p-10">
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                                Return Request
                            </p>

                            <h2 className="mt-4 font-serif text-3xl text-neutral-900">
                                Contact LYRA
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-neutral-600">
                                If you need to initiate a return or have a
                                question about an order, contact the LYRA
                                customer care team with your order details.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Condition */}
            <section className="border-y border-neutral-200 bg-neutral-50 px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Item Condition
                        </p>

                        <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                            Keep your item in its original condition.
                        </h2>
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-neutral-600">
                        <p>
                            Items intended for return should be kept in
                            appropriate condition until the return request
                            has been reviewed.
                        </p>

                        <p>
                            Please retain the original packaging and any
                            included product materials where applicable.
                        </p>
                    </div>
                </div>
            </section>

            {/* Refund Information */}
            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                        Refunds
                    </p>

                    <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                        We will keep you informed.
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-neutral-600">
                        Once a return has been reviewed and approved, the
                        applicable refund information will be communicated
                        through the order or customer care process.
                    </p>
                </div>
            </section>
        </main>
    );
}