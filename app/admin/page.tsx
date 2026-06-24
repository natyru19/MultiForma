import Link from "next/link";
import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

export default async function AdminPage() {
    const profile = await getCurrentProfile();

    if (!profile) {
        redirect("/login?redirect=/admin");
    }

    if (profile.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <BackLink href="/" label="Volver a la tienda" className="mb-6" />

            <h1 className="text-3xl font-bold mb-6">
                Panel de Administración
            </h1>

            <div className="space-y-4">
                <Link
                    href="/admin/products"
                    className="block border rounded p-4 hover:bg-gray-50 transition"
                >
                    Gestionar productos
                </Link>
            </div>
        </div>
    );
}
