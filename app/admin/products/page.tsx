import Link from "next/link";
import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

export default async function AdminProductsPage() {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin/products");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    const supabase = await createClient();

    const { data: products } = await supabase
        .from("products")
        .select(`
            *,
            categories (
                name
            ),
            variants (
                id
            )
        `)
        .order("name");

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <BackLink href="/admin" label="Panel de administración" />
                    <h1 className="text-3xl font-bold mt-2">Productos</h1>
                </div>

                <Link
                    href="/admin/products/new"
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Nuevo producto
                </Link>
            </div>

            {products?.length === 0 && (
                <p className="text-gray-500 border rounded p-6 text-center">
                    No hay productos todavía.{" "}
                    <Link href="/admin/products/new" className="underline">
                        Crear el primero
                    </Link>
                </p>
            )}

            <div className="space-y-4">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="border rounded p-4 flex justify-between items-start gap-4"
                    >
                        <div className="flex gap-4">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded border"
                                />
                            )}

                            <div>
                                <p className="font-semibold">{product.name}</p>

                                <p className="text-sm text-gray-500">
                                    {product.categories?.name || "Sin categoría"}
                                </p>

                                <p className="text-sm mt-1 text-gray-500">
                                    {product.variants?.length || 0} variante
                                    {(product.variants?.length || 0) === 1 ? "" : "s"}
                                </p>

                                <p className="text-sm mt-1">
                                    {product.featured ? "Destacado" : "No destacado"}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="border px-4 py-2 rounded shrink-0 hover:bg-gray-50"
                        >
                            Editar
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
