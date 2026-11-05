"use client";

import { useOptimistic, useState } from "react";
import { useFormStatus } from "react-dom";
import { ratePizzaAction } from "@/app/actions";
import type { RatingSummary } from "@/lib/types";

function StarButton({ stars }: { stars: number }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            name="stars"
            value={stars}
            disabled={pending}
            aria-label={`Beri ${stars} bintang`}
            className="text-3xl text-amber-500 hover:scale-110 disabled:opacity-50"
        >
            ★
        </button>
    );
}

function SubmitStatus() {
    const { pending } = useFormStatus();
    return pending ? <p className="mt-2 text-sm">Mengirim…</p> : null;
}

export default function RatingPanel({
                                        pizzaId,
                                        summary,
                                    }: {
    pizzaId: string;
    summary: RatingSummary;
}) {
    const [optimistic, addOptimistic] = useOptimistic(
        summary,
        (current: RatingSummary, stars: number): RatingSummary => ({
            average:
                (current.average * current.count + stars) / (current.count + 1),
            count: current.count + 1,
        }),
    );
    const [error, setError] = useState<string | null>(null);

    async function submit(formData: FormData) {
        setError(null);
        const stars = Number(formData.get("stars"));
        if (Number.isInteger(stars) && stars >= 1 && stars <= 5) {
            addOptimistic(stars);
        }
        const result = await ratePizzaAction(pizzaId, formData);
        if (!result.ok) setError(result.error);
    }

    return (
        <section className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
            <h2 className="text-lg font-bold">Rating pelanggan</h2>
            <p className="mt-1 text-ink/70" data-testid="rating-summary">
                {`★ ${optimistic.average.toFixed(1)} dari ${optimistic.count} rating`}
            </p>
            <form action={submit}>
                <div className="mt-4 flex gap-1" aria-label="Beri rating">
                    {[1, 2, 3, 4, 5].map((stars) => (
                        <StarButton key={stars} stars={stars} />
                    ))}
                </div>
                <SubmitStatus />
            </form>
            {error && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                    {error}
                </p>
            )}
        </section>
    );
}