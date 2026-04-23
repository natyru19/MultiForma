"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import VariantSelector from "@/components/VariantSelector";

export default function ProductDetail({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = use(params);

    const [product, setProduct] = useState<any>(null);
    const [selectedTipo, setSelectedTipo] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
        const { data, error } = await supabase
            .from("products")
            .select(`
            *,
            variants:variants!product_id (*)
            `)
            .eq("id", id)
            .single();

        if (!error) setProduct(data);
        };

        fetchProduct();
    }, [id]);

    if (!product) return <p className="p-6">Cargando...</p>;

    const selectedVariant = product.variants.find(
        (v: any) =>
        v.tipo === selectedTipo && v.color === selectedColor
    );

    const images = product.variants.map((v: any) => v.image);

    return (
        <div className="p-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

        <div className="flex flex-col items-center">

            <img
            src={selectedVariant?.image || images[currentIndex]}
            className="w-full max-h-96 object-contain rounded-xl border"
            />

            <div className="flex justify-between w-full mt-2">
            <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}>
                ◀
            </button>

            <button
                onClick={() =>
                setCurrentIndex((prev) =>
                    Math.min(prev + 1, images.length - 1)
                )
                }
            >
                ▶
            </button>
            </div>

            <div className="flex gap-2 mt-4">
            {images.map((img: string, i: number) => (
                <img
                key={i}
                src={img}
                onClick={() => setCurrentIndex(i)}
                className="w-16 h-16 object-cover rounded cursor-pointer border"
                />
            ))}
            </div>
        </div>

        <div>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            <p className="text-gray-500 mt-2">
            {product.description}
            </p>

            <VariantSelector
            product={product}
            selectedTipo={selectedTipo}
            selectedColor={selectedColor}
            setSelectedTipo={setSelectedTipo}
            setSelectedColor={setSelectedColor}
            />

            {selectedVariant && (
            <div className="mt-6 text-xl font-semibold">
                Precio: ${selectedVariant.price}
                <br />
                Stock: {selectedVariant.stock}
            </div>
            )}

        </div>
        </div>
    );
}