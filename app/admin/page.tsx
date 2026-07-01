import Link from "next/link";
import BackLink from "@/components/BackLink";
import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/app/lib/getCurrentProfile";

const adminLinkClass =
    "block border border-gray-300 rounded-lg p-4 text-gray-900 hover:bg-gray-100 hover:border-gray-400 transition";

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
                <Link href="/admin/products" className={adminLinkClass}>
                    <span className="font-medium">Gestionar productos</span>
                    <p className="text-sm text-gray-600 mt-1">
                        Productos activos visibles en la tienda
                    </p>
                </Link>

                <Link
                    href="/admin/products?status=inactive"
                    className={adminLinkClass}
                >
                    <span className="font-medium">Productos inactivos</span>
                    <p className="text-sm text-gray-600 mt-1">
                        Productos ocultos temporalmente en la tienda
                    </p>
                </Link>

                <Link href="/admin/categories" className={adminLinkClass}>
                    <span className="font-medium">Gestionar categorías</span>
                    <p className="text-sm text-gray-600 mt-1">
                        Categorías activas visibles en la tienda
                    </p>
                </Link>

                <Link
                    href="/admin/categories?status=inactive"
                    className={adminLinkClass}
                >
                    <span className="font-medium">Categorías inactivas</span>
                    <p className="text-sm text-gray-600 mt-1">
                        Categorías ocultas temporalmente en la tienda
                    </p>
                </Link>
            </div>
        </div>
    );
}
