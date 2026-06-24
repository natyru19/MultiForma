import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import BackLink from "@/components/BackLink";

export default async function CategoryDetail({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", id);

    if (error) {
        return <p>Error cargando productos</p>;
    }

    if (!products || products.length === 0) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <BackLink href="/categories" label="Categorías" />
                <p>No hay productos en esta categoría</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <BackLink href="/categories" label="Categorías" />

        <h1 className="text-2xl font-bold mb-6 capitalize">{id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product: any) => (
            <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="border p-4 rounded hover:shadow"
            >
                <img
                src={product.image}
                className="w-full h-40 object-cover"
                />
                <p className="mt-2">{product.name}</p>
            </Link>
            ))}
        </div>
        </div>
    );
}