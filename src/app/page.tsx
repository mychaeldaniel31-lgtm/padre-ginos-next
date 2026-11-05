import MenuExplorer from "@/components/MenuExplorer";
import PizzaOfTheDay from "@/components/PizzaOfTheDay";
import { getFavoriteIds, getPizzas } from "@/lib/data";

export default async function MenuPage() {
    const pizzas = await getPizzas();
    const favoriteIdsPromise = getFavoriteIds();

    return (
        <section>
            <PizzaOfTheDay />
            <h1 className="mb-6 text-3xl font-black">Menu</h1>
            <MenuExplorer pizzas={pizzas} favoriteIdsPromise={favoriteIdsPromise} />
        </section>
    );
}