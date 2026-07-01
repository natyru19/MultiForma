import BackLink from "@/components/BackLink";
import { redirect, notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";
import CategoryForm from "../../CategoryForm";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: PageProps) {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin/categories");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    const { id } = await params;
    const supabase = await createClient();

    const { data: category, error } = await supabase
        .from("categories")
        .select("id, name, image")
        .eq("id", id)
        .single();

    if (error || !category) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <BackLink
                href="/admin/categories"
                label="Categorías"
                className="mb-6"
            />

            <h1 className="text-3xl font-bold mb-6">Editar categoría</h1>

            <CategoryForm category={category} />
        </div>
    );
}
