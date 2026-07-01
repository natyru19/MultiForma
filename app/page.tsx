import ProductCard from "@/components/ProductCard";
import { getCategories } from "@/lib/getCategories";
import CategoriesSlider from "@/components/CategoriesSlider";
import HomePromoBanner from "@/components/HomePromoBanner";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {

  const supabase = await createClient();

  const categories = await getCategories();
  
  const { data: products, error } = await supabase
    .from("products")
    .select(`
              *,
              categories:category_id (*),
              variants:variants!product_id (*)
          `)
    .eq("active", true);

  if (error) {
    console.error(error);
  }

  return (
    <main className="p-6 text-center">
      <section className="mt-10">
        <h1 className="text-3xl font-bold">Impresión 3D personalizada</h1>

        <p className="mt-4">Creamos lo que imagines</p>

        <HomePromoBanner />
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
