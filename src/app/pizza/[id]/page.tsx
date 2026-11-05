import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RatingPanel from "@/components/RatingPanel";
import SizePicker from "@/components/SizePicker";
import {getPizza, getPizzas, getRatingSummary} from "@/lib/data";
import {Suspense} from "react";

export async function generateStaticParams() {
    const pizzas = await getPizzas();
    return pizzas.map((p) => ({ id: p.id }));
}

async function Ratings({ id }: { id: string }) {
    const summary = await getRatingSummary(id);
    return <RatingPanel pizzaId={id} summary={summary} />;
}

export default async function PizzaDetail({
                                              params,
                                          }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const pizza = await getPizza(id);
    if (!pizza) notFound();

    return (
        <article className="grid gap-8 md:grid-cols-2">
            <Image
                src={pizza.image}
                alt={pizza.name}
                width={600}
                height={600}
                priority
                className="aspect-square w-full rounded-3xl object-cover shadow"
            />
            <div className="flex flex-col gap-6">
                <div>
                    <Link href="/" className="text-sm text-brand underline">
                        ← Menu
                    </Link>
                    <h1 className="mt-2 text-4xl font-black">{pizza.name}</h1>
                    <p className="mt-1 font-medium text-ink/60">{pizza.category}</p>
                </div>
                <p className="text-lg">{pizza.description}</p>
                <SizePicker sizes={pizza.sizes} />
                <Suspense fallback={<p>Memuat rating…</p>}>
                    <Ratings id={pizza.id} />
                </Suspense>
            </div>
        </article>
    );
}