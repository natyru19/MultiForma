import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/app/lib/getCurrentProfile";
import CategoryForm from "../CategoryForm";

export default async function NewCategoryPage() {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin/categories/new");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <BackLink
                href="/admin/categories"
                label="Categorías"
                className="mb-6"
            />

            <h1 className="text-3xl font-bold mb-6">Nueva categoría</h1>

            <CategoryForm />
        </div>
    );
}
