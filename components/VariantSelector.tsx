"use client";

type Variant = {
    id: string;
    tipo: string;
    color: string;
};

export default function VariantSelector({
    product,
    selectedTipo,
    selectedColor,
    setSelectedTipo,
    setSelectedColor
}: any) {

    const tipos = [
    ...new Set(product.variants.map((v: Variant) => v.tipo))
    ] as string[];

    const colores = [
    ...new Set(product.variants.map((v: Variant) => v.color))
    ] as string[];

    return (
        <div className="mt-6">

        <div className="mb-4">
            <p className="font-semibold">Tipo</p>
            <div className="flex gap-2 mt-2">
            {tipos.map((tipo) => (
                <button
                key={tipo}
                onClick={() => setSelectedTipo(tipo)}
                className={`px-3 py-1 rounded border ${
                    selectedTipo === tipo ? "bg-white text-black" : ""
                }`}
                >
                {tipo}
                </button>
            ))}
            </div>
        </div>

        <div className="mb-4">
            <p className="font-semibold">Color</p>
            <div className="flex gap-2 mt-2">
            {colores.map((color) => (
                <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1 rounded border ${
                    selectedColor === color ? "bg-white text-black" : ""
                }`}
                >
                {color}
                </button>
            ))}
            </div>
        </div>

        </div>
    );
}