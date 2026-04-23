import ProductCard from "@/components/ProductCard";
import { getCategories } from "@/lib/getCategories";
import CategoriesSlider from "@/components/CategoriesSlider";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const categories = await getCategories();
  const { data: products, error } = await supabase.from("products").select(`
              *,
              categories:category_id (*),
              variants:variants!product_id (*)
          `);

  if (error) {
    console.error(error);
  }

  return (
    <main className="p-6 text-center">
      <section className="mt-10">
        <h1 className="text-3xl font-bold">Impresión 3D personalizada</h1>

        <p className="mt-4">Creamos lo que imagines</p>

        <button className="mt-6 bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded">
          Registrate y obtené 10% OFF
        </button>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center">Productos destacados</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <CategoriesSlider categories={categories} />
      </section>
    </main>
  );
}
