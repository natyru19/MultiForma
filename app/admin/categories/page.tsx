import Link from "next/link";
import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";
import CategoryActiveToggle from "./CategoryActiveToggle";
import DeleteCategoryButton from "./DeleteCategoryButton";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

type PageProps = {
    searchParams: Promise<{ status?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin/categories");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    const { status } = await searchParams;
    const showInactive = status === "inactive";

    const supabase = await createClient();

    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("active", !showInactive)
        .order("name");

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <BackLink href="/admin" label="Panel de administración" />
                    <h1 className="text-3xl font-bold mt-2">
                        {showInactive
                            ? "Categorías inactivas"
                            : "Categorías activas"}
                    </h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        {showInactive
                            ? "Categorías ocultas en la tienda."
                            : "Categorías visibles en la tienda."}
                    </p>
                </div>

                {!showInactive && (
                    <Link
                        href="/admin/categories/new"
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Nueva categoría
                    </Link>
                )}
            </div>

            <div className="flex gap-3 mb-6">
                <Link
                    href="/admin/categories"
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                        !showInactive
                            ? "bg-gray-900 text-white border-gray-900"
                            : "text-gray-900 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    Activas
                </Link>
                <Link
                    href="/admin/categories?status=inactive"
                    className={`px-4 py-2 rounded border text-sm font-medium transition ${
                        showInactive
                            ? "bg-gray-900 text-white border-gray-900"
                            : "text-gray-900 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    Inactivas
                </Link>
            </div>

            {categories?.length === 0 && (
                <p className="text-gray-500 border rounded p-6 text-center">
                    {showInactive
                        ? "No hay categorías inactivas."
                        : "No hay categorías activas todavía. "}
                    {!showInactive && (
                        <Link href="/admin/categories/new" className="underline">
                            Crear la primera
                        </Link>
                    )}
                </p>
            )}

            <div className="space-y-4">
                {categories?.map((category) => (
                    <div
                        key={category.id}
                        className={`border rounded p-4 flex justify-between items-start gap-4 ${
                            showInactive ? "bg-gray-50 opacity-90" : ""
                        }`}
                    >
                        <div className="flex gap-4 items-center">
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-16 h-16 object-cover rounded-full border shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-400 shrink-0">
                                    {category.name.charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div>
                                <p className="font-semibold">{category.name}</p>
                                <p className="text-sm text-gray-500">
                                    /categories/{category.slug}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 shrink-0">
                            <CategoryActiveToggle
                                categoryId={category.id}
                                active={category.active ?? true}
                            />

                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/categories/${category.id}/edit`}
                                    className="border px-4 py-2 rounded text-gray-900 hover:bg-gray-100"
                                >
                                    Editar
                                </Link>

                                <DeleteCategoryButton
                                    categoryId={category.id}
                                    categoryName={category.name}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
