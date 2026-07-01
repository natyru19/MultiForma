"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";

type Category = {
    id: string;
    name: string;
    image: string | null;
};

type Props = {
    category?: Category;
};

export default function CategoryForm({ category }: Props) {
    const router = useRouter();
    const isEditing = Boolean(category);

    const [name, setName] = useState(category?.name ?? "");
    const [image, setImage] = useState(category?.image ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (imageUploading) return;

        setError("");
        setLoading(true);

        const url = isEditing
            ? `/api/admin/categories/${category!.id}`
            : "/api/admin/categories";

        const response = await fetch(url, {
            method: isEditing ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                image: image || null,
            }),
        });

        const result = await response.json();
        setLoading(false);

        if (!response.ok) {
            setError(result.error || "Error al guardar la categoría");
            return;
        }

        router.push("/admin/categories");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                    Nombre
                </label>
                <input
                    id="name"
                    type="text"
                    className="w-full border rounded p-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ej: Luthier, Decoración"
                />
                <p className="text-sm text-gray-500 mt-1">
                    La URL se genera automáticamente a partir del nombre.
                </p>
            </div>

            <ImageUploadField
                label="Imagen"
                value={image}
                onChange={setImage}
                optional
                onUploadingChange={setImageUploading}
            />

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading || imageUploading}
                    className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
                >
                    {loading
                        ? "Guardando..."
                        : isEditing
                          ? "Guardar cambios"
                          : "Crear categoría"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/admin/categories")}
                    className="border px-5 py-3 rounded text-gray-900 hover:bg-gray-100"
                >
                    Cancelar
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                    {error}
                </div>
            )}
        </form>
    );
}
