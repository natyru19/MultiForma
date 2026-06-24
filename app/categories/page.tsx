import CategoryGrid from "@/components/CategoryGrid";
import BackLink from "@/components/BackLink";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

    if (error) {
        return <p>Error cargando categorías</p>;
    }

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <BackLink href="/" label="Inicio" />

            <h1 className="text-3xl font-bold text-center mt-2">Categorías</h1>

            <p className="text-center text-gray-500 mt-2">
                Explorá nuestros productos por categoría
            </p>

            <CategoryGrid categories={categories || []} />
        </main>
    );
}
