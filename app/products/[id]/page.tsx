"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import VariantSelector from "@/components/VariantSelector";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import BackLink from "@/components/BackLink";

export default function ProductDetail({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = use(params);

    const [product, setProduct] = useState<any | undefined>(undefined);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        async function fetchProduct() {
            setProduct(undefined);

            const supabase = createClient();

            const { data, error } = await supabase
                .from("products")
                .select(`
                *,
                variants:variants!product_id (*)
            `)
                .eq("id", id)
                .eq("active", true)
                .single();

            setProduct(!error && data ? data : null);
        }

        fetchProduct();
    }, [id]);

    useEffect(() => {
        setQuantity(1);
    }, [selectedOption, selectedColor]);

    if (product === undefined) {
        return <p className="p-6">Cargando...</p>;
    }

    if (product === null) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <BackLink href="/products" label="Catálogo" className="mb-6" />
                <p className="text-gray-600">
                    Este producto no está disponible en este momento.
                </p>
            </div>
        );
    }

    const variants = product.variants ?? [];

    const selectedVariant = variants.find((v: any) => {
        const matchOption = v.option === selectedOption;
        const matchColor = v.color
            ? v.color === selectedColor
            : true;

        return matchOption && matchColor;
    });

    const variantImages = variants
        .map((v: any) => v.image)
        .filter(Boolean);

    const displayImages =
        variantImages.length > 0
            ? variantImages
            : product.image
              ? [product.image]
              : [];

    const displayImage =
        selectedVariant?.image ||
        displayImages[currentIndex] ||
        product.image;

    const maxStock = selectedVariant?.stock ?? 0;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <BackLink href="/products" label="Catálogo" className="mb-6" />

            <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col items-center">
                {displayImage ? (
                    <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full max-h-96 object-contain rounded-xl border"
                    />
                ) : (
                    <div className="w-full h-96 border rounded-xl flex items-center justify-center text-gray-400">
                        Sin imagen
                    </div>
                )}

                {displayImages.length > 1 && (
                    <>
                        <div className="flex justify-between w-full mt-2">
                            <button onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}>
                                ◀
                            </button>

                            <button
                                onClick={() =>
                                setCurrentIndex((prev) =>
                                    Math.min(prev + 1, displayImages.length - 1)
                                )
                                }
                            >
                                ▶
                            </button>
                        </div>

                        <div className="flex gap-2 mt-4">
                        {displayImages.map((img: string, i: number) => (
                            <img
                            key={i}
                            src={img}
                            alt={`${product.name} ${i + 1}`}
                            onClick={() => setCurrentIndex(i)}
                            className="w-16 h-16 object-cover rounded cursor-pointer border"
                            />
                        ))}
                        </div>
                    </>
                )}
            </div>

            <div>

                <h1 className="text-3xl font-bold">{product.name}</h1>

                <p className="text-gray-500 mt-2">
                {product.description}
                </p>

                {variants.length > 0 ? (
                    <>
                        <VariantSelector
                        product={product}
                        selectedOption={selectedOption}
                        selectedColor={selectedColor}
                        setSelectedOption={setSelectedOption}
                        setSelectedColor={setSelectedColor}
                        />

                        {selectedVariant && (
                        <div className="mt-6 space-y-4">
                            <div className="text-xl font-semibold">
                                Precio: ${selectedVariant.price}
                                <br />
                                Stock disponible: {selectedVariant.stock}
                            </div>

                            {maxStock > 0 && (
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Cantidad
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((prev) =>
                                                    Math.max(1, prev - 1)
                                                )
                                            }
                                            disabled={quantity <= 1}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuantity((prev) =>
                                                    Math.min(maxStock, prev + 1)
                                                )
                                            }
                                            disabled={quantity >= maxStock}
                                            className="px-3 py-1 border rounded disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        )}

                        <div className="mt-6 space-y-3">
                            <AddToCartButton
                                productId={product.id}
                                variantId={selectedVariant?.id}
                                price={selectedVariant?.price}
                                quantity={quantity}
                                maxStock={maxStock}
                            />

                            <BuyNowButton
                                productId={product.id}
                                variantId={selectedVariant?.id}
                                price={selectedVariant?.price}
                                quantity={quantity}
                                maxStock={maxStock}
                            />
                        </div>
                    </>
                ) : (
                    <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Este producto aún no tiene variantes disponibles. No se puede
                        comprar por ahora.
                    </p>
                )}
            </div>
            </div>
        </div>
    );
}
