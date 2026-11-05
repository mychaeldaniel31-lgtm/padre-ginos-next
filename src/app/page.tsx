import { Suspense } from "react";
import MenuExplorer from "@/components/MenuExplorer";
import { getFavoriteIds, getPizzas } from "@/lib/data";

export default async function MenuPage() {
    const pizzas = await getPizzas();
    const favoriteIdsPromise = getFavoriteIds();

    return (
        <section>
            <h1 className="mb-6 text-3xl font-black">Menu</h1>
            <Suspense fallback={<p>Loading menu...</p>}>
                <MenuExplorer pizzas={pizzas} favoriteIdsPromise={favoriteIdsPromise} />
            </Suspense>
        </section>
    );
}