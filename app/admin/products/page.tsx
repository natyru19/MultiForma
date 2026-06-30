import Link from "next/link";
import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";
import DeleteProductButton from "./DeleteProductButton";
import ProductActiveToggle from "./ProductActiveToggle";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

type PageProps = {
    searchParams: Promise<{ status?: string }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin/products");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    const { status } = await searchParams;
    const showInactive = status === "inactive";

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
        .eq("active", !showInactive)
        .order("name");

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <BackLink href="/admin" label="Panel de administración" />
                    <h1 className="text-3xl font-bold mt-2">
                        {showInactive ? "Productos inactivos" : "Productos activos"}
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        {showInactive
                            ? "Productos ocultos en la tienda. Podés reactivarlos cuando vuelvan a estar disponibles."
                            : "Productos visibles en la tienda."}
                    </p>
                </div>

                {!showInactive && (
                    <Link
                        href="/admin/products/new"
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Nuevo producto
                    </Link>
                )}
            </div>

            <div className="flex gap-3 mb-6">
                <Link
                    href="/admin/products"
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                        !showInactive
                            ? "bg-gray-900 text-white border-gray-900"
                            : "text-gray-900 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    Activos
                </Link>
                <Link
                    href="/admin/products?status=inactive"
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                        showInactive
                            ? "bg-gray-900 text-white border-gray-900"
                            : "text-gray-900 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    Inactivos
                </Link>
            </div>

            {products?.length === 0 && (
                <p className="text-gray-500 border rounded p-6 text-center">
                    {showInactive
                        ? "No hay productos inactivos."
                        : "No hay productos activos todavía. "}
                    {!showInactive && (
                        <Link href="/admin/products/new" className="underline">
                            Crear el primero
                        </Link>
                    )}
                </p>
            )}

            <div className="space-y-4">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className={`border rounded p-4 flex justify-between items-start gap-4 ${
                            showInactive ? "bg-gray-50 opacity-90" : ""
                        }`}
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

                        <div className="flex items-start gap-4 shrink-0">
                            <ProductActiveToggle
                                productId={product.id}
                                active={product.active ?? true}
                            />

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/products/${product.id}/edit`}
                                    className="border px-4 py-2 rounded text-gray-900 hover:bg-gray-100"
                                >
                                    Editar
                                </Link>

                                <DeleteProductButton
                                    productId={product.id}
                                    productName={product.name}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
