import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function CategoryDetail({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;

    const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", id);

    if (error) {
        return <p>Error cargando productos</p>;
    }

    if (!products || products.length === 0) {
        return <p className="p-6">No hay productos en esta categoría</p>;
    }

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">{id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product: any) => (
            <Link
                key={product.id}
                href={`/productos/${product.id}`}
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