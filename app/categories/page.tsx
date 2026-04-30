import CategoriesSlider from "@/components/CategoriesSlider";
import { supabase } from "@/lib/supabase";

export default async function CategoriesPage() {

  const { data: categories, error } = await supabase
        .from("categories")
        .select("*");

    if (error) {
        return <p>Error cargando categorías</p>;
    }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-center">Categorías</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <CategoriesSlider categories={ categories || [] } />
      </div>
    </main>
  );
}
