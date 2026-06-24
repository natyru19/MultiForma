import { notFound, redirect } from "next/navigation";

import BackLink from "@/components/BackLink";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";
import EditProductForm from "./EditProductForm";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;

    const profile = await getCurrentProfile();

    if (!profile) {
        redirect(`/login?redirect=/admin/products/${id}/edit`);
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    const supabase = await createClient();

    const [{ data: product, error: productError }, { data: categories }] =
        await Promise.all([
            supabase
                .from("products")
                .select("*")
                .eq("id", id)
                .single(),
            supabase.from("categories").select("id, name").order("name"),
        ]);

    if (productError || !product) {
        notFound();
    }

    const { data: variants } = await supabase
        .from("variants")
        .select("*")
        .eq("product_id", id)
        .order("price", { ascending: true });

    return (
        <div className="max-w-3xl mx-auto p-6">
            <BackLink href="/admin/products" label="Productos" className="mb-6" />

            <h1 className="text-3xl font-bold mb-2">Editar producto</h1>
            <p className="text-gray-500 mb-8">{product.name}</p>

            <EditProductForm
                product={product}
                variants={variants || []}
                categories={categories || []}
            />
        </div>
    );
}
