import Link from "next/link";
import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/app/lib/getCurrentProfile";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin/products/new");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    const supabase = await createClient();

    const { data: categories, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

    if (error) {
        console.error("Error cargando categorías:", error);
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <BackLink href="/admin/products" label="Productos" className="mb-6" />

            <h1 className="text-3xl font-bold mb-6">Nuevo producto</h1>

            <NewProductForm categories={categories || []} />
        </div>
    );
}
