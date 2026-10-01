export default function AboutPage() {
    return (
        <main className="bg-white">
            <section className="border-b border-neutral-200 px-6 py-20 md:px-10 md:py-28">
                <div className="mx-auto max-w-5xl text-center">
                    <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                        About LYRA
                    </p>

                    <h1 className="mt-5 font-serif text-4xl leading-tight text-neutral-900 md:text-6xl">
                        Minimal. Modern. Effortless.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
                        LYRA is a contemporary fashion label built around
                        considered design, refined silhouettes, and effortless
                        everyday elegance.
                    </p>
                </div>
            </section>

            <section className="px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-20">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            Our Philosophy
                        </p>

                        <h2 className="mt-4 font-serif text-3xl text-neutral-900 md:text-4xl">
                            Less, but considered.
                        </h2>
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-neutral-600">
                        <p>
                            LYRA focuses on pieces that feel modern without
                            being defined by passing trends.
                        </p>

                        <p>
                            From silhouette and proportion to texture and
                            detail, every element is approached with
                            simplicity and intention.
                        </p>

                        <p>
                            The result is a wardrobe designed to feel
                            versatile, refined, and distinctly personal.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-y border-neutral-200 bg-neutral-50 px-6 py-16 md:px-10 md:py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <p className="font-serif text-3xl leading-tight text-neutral-900 md:text-5xl">
                        Designed for the way modern women live, move, and
                        express themselves.
                    </p>
                </div>
            </section>
        </main>
    );
}