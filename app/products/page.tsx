import ProductCard from "@/components/ProductCard";
import BackLink from "@/components/BackLink";
import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {

    const supabase = await createClient();
    
    const { data: products, error } = await supabase
        .from("products")
        .select(`
            *,
            categories:category_id (*),
            variants:variants!product_id (*)
        `);

    if (error) {
        console.error(error);
    }

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <BackLink href="/" label="Inicio" />

            <h1 className="text-3xl font-bold text-center">
                Nuestros productos
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}