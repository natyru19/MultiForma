"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
    id: string;
    name: string;
};

type Props = {
    categories: Category[];
};

export default function NewProductForm({ categories }: Props) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [featured, setFeatured] = useState(false);

    const [variantPrice, setVariantPrice] = useState("");
    const [variantStock, setVariantStock] = useState("");
    const [variantOption, setVariantOption] = useState("");
    const [variantColor, setVariantColor] = useState("");
    const [variantImage, setVariantImage] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const response = await fetch("/api/admin/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                image,
                category_id: categoryId,
                featured,
                variant: {
                    price: Number(variantPrice),
                    stock: Number(variantStock),
                    option: variantOption || null,
                    color: variantColor || null,
                    image: variantImage || null,
                },
            }),
        });

        const result = await response.json();
        setLoading(false);

        if (!response.ok) {
            setError(result.error || "Error al crear el producto");
            return;
        }

        router.push("/admin/products");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Información del producto</h2>

                <div>
                    <label className="block mb-1 font-medium">Nombre</label>
                    <input
                        type="text"
                        className="w-full border rounded p-3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Nombre del producto"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Descripción</label>
                    <textarea
                        className="w-full border rounded p-3 min-h-[120px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Descripción del producto"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Imagen principal (URL)</label>
                    <input
                        type="url"
                        className="w-full border rounded p-3"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Categoría</label>
                    <select
                        className="w-full border rounded p-3 bg-black text-white"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="" className="bg-black text-white">
                            Seleccionar categoría
                        </option>
                        {categories.map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                                className="bg-black text-white"
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="featured"
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <label htmlFor="featured">Producto destacado</label>
                </div>
            </section>

            <section className="space-y-4 border-t pt-6">
                <div>
                    <h2 className="text-lg font-semibold">Variante inicial</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Cada producto necesita al menos una variante con precio y stock
                        para mostrarse en el catálogo y poder comprarse.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Precio ($)</label>
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            className="w-full border rounded p-3"
                            value={variantPrice}
                            onChange={(e) => setVariantPrice(e.target.value)}
                            required
                            placeholder="1500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Stock</label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            className="w-full border rounded p-3"
                            value={variantStock}
                            onChange={(e) => setVariantStock(e.target.value)}
                            required
                            placeholder="10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            Opción <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded p-3"
                            value={variantOption}
                            onChange={(e) => setVariantOption(e.target.value)}
                            placeholder="Ej: Grande, 20cm"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Color <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border rounded p-3"
                            value={variantColor}
                            onChange={(e) => setVariantColor(e.target.value)}
                            placeholder="Ej: Negro"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Imagen de la variante{" "}
                        <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <input
                        type="url"
                        className="w-full border rounded p-3"
                        value={variantImage}
                        onChange={(e) => setVariantImage(e.target.value)}
                        placeholder="Si no completás, se usa la imagen principal"
                    />
                </div>
            </section>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
                >
                    {loading ? "Creando..." : "Crear producto"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/admin/products")}
                    className="border px-5 py-3 rounded"
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
