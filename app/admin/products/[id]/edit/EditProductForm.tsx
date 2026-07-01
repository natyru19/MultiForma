"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";

type Category = {
    id: string;
    name: string;
};

type Variant = {
    id: string;
    price: number;
    stock: number;
    option: string | null;
    color: string | null;
    image: string | null;
};

type Product = {
    id: string;
    name: string;
    description: string;
    image: string | null;
    category_id: string;
    featured: boolean;
};

type Props = {
    product: Product;
    variants: Variant[];
    categories: Category[];
};

export default function EditProductForm({
    product,
    variants: initialVariants,
    categories,
}: Props) {
    const router = useRouter();

    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [image, setImage] = useState(product.image || "");
    const [categoryId, setCategoryId] = useState(product.category_id);
    const [featured, setFeatured] = useState(product.featured);

    const [variants, setVariants] = useState(initialVariants);

    const [variantPrice, setVariantPrice] = useState("");
    const [variantStock, setVariantStock] = useState("");
    const [variantOption, setVariantOption] = useState("");
    const [variantColor, setVariantColor] = useState("");
    const [variantImage, setVariantImage] = useState("");

    const [savingProduct, setSavingProduct] = useState(false);
    const [addingVariant, setAddingVariant] = useState(false);
    const [productError, setProductError] = useState("");
    const [variantError, setVariantError] = useState("");
    const [variantSuccess, setVariantSuccess] = useState("");
    const [productImageUploading, setProductImageUploading] = useState(false);
    const [variantImageUploading, setVariantImageUploading] = useState(false);

    const isUploading = productImageUploading || variantImageUploading;

    async function handleProductSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isUploading) return;
        setProductError("");
        setSavingProduct(true);

        const response = await fetch(`/api/admin/products/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                description,
                image,
                category_id: categoryId,
                featured,
            }),
        });

        const result = await response.json();
        setSavingProduct(false);

        if (!response.ok) {
            setProductError(result.error || "Error al guardar el producto");
            return;
        }

        router.refresh();
    }

    async function handleVariantSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isUploading) return;
        setVariantError("");
        setVariantSuccess("");
        setAddingVariant(true);

        const response = await fetch(
            `/api/admin/products/${product.id}/variants`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    variant: {
                        price: Number(variantPrice),
                        stock: Number(variantStock),
                        option: variantOption || null,
                        color: variantColor || null,
                        image: variantImage || null,
                    },
                }),
            }
        );

        const result = await response.json();
        setAddingVariant(false);

        if (!response.ok) {
            setVariantError(result.error || "Error al agregar la variante");
            return;
        }

        setVariants((current) => [...current, result.data]);
        setVariantPrice("");
        setVariantStock("");
        setVariantOption("");
        setVariantColor("");
        setVariantImage("");
        setVariantSuccess("Variante agregada correctamente");
        router.refresh();
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handleProductSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">Información del producto</h2>

                <div>
                    <label className="block mb-1 font-medium">Nombre</label>
                    <input
                        type="text"
                        className="w-full border rounded p-3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Descripción</label>
                    <textarea
                        className="w-full border rounded p-3 min-h-[120px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <ImageUploadField
                    label="Imagen principal"
                    value={image}
                    onChange={setImage}
                    optional
                    onUploadingChange={setProductImageUploading}
                />

                <div>
                    <label className="block mb-1 font-medium">Categoría</label>
                    <select
                        className="w-full border rounded p-3 bg-black text-white"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
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
                        id="featured-edit"
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                    />
                    <label htmlFor="featured-edit">Producto destacado</label>
                </div>

                <button
                    type="submit"
                    disabled={savingProduct || isUploading}
                    className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
                >
                    {savingProduct ? "Guardando..." : "Guardar cambios"}
                </button>

                {productError && (
                    <div
                        role="alert"
                        className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        {productError}
                    </div>
                )}
            </form>

            <section className="border-t pt-8 space-y-4">
                <h2 className="text-lg font-semibold">Variantes existentes</h2>

                {variants.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        Este producto no tiene variantes. Agregá una abajo para
                        que aparezca en el catálogo con precio y stock.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {variants.map((variant) => (
                            <div
                                key={variant.id}
                                className="border rounded p-4 flex gap-4 items-center"
                            >
                                {variant.image && (
                                    <img
                                        src={variant.image}
                                        alt="Variante"
                                        className="w-14 h-14 rounded-full object-cover border shrink-0"
                                    />
                                )}

                                <div className="text-sm space-y-1">
                                    <p className="font-medium">${variant.price}</p>
                                    <p>Stock: {variant.stock}</p>
                                    {variant.option && <p>Opción: {variant.option}</p>}
                                    {variant.color && <p>Color: {variant.color}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <form
                onSubmit={handleVariantSubmit}
                className="border-t pt-8 space-y-4"
            >
                <div>
                    <h2 className="text-lg font-semibold">Agregar variante</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Sumá nuevas opciones de talle, color o precio para este
                        producto.
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

                <ImageUploadField
                    label="Imagen de la variante"
                    value={variantImage}
                    onChange={setVariantImage}
                    optional
                    hint="Si no subís una, se usa la imagen principal del producto."
                    onUploadingChange={setVariantImageUploading}
                />

                <button
                    type="submit"
                    disabled={addingVariant || isUploading}
                    className="bg-black text-white px-6 py-3 rounded disabled:opacity-50"
                >
                    {addingVariant ? "Agregando..." : "Agregar variante"}
                </button>

                {variantSuccess && (
                    <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {variantSuccess}
                    </div>
                )}

                {variantError && (
                    <div
                        role="alert"
                        className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        {variantError}
                    </div>
                )}
            </form>
        </div>
    );
}
