"use client";

type Variant = {
    id: string;
    option: string;
    color: string;
};

export default function VariantSelector({
    product,
    selectedOption,
    selectedColor,
    setSelectedOption,
    setSelectedColor
}: any) {

    const options = [
    ...new Set(product.variants.map((v: Variant) => v.option))
    ] as string[];

    const colors = [
    ...new Set(product.variants.map((v: Variant) => v.color))
    ] as string[];

    return (
        <div className="mt-6">

        <div className="mb-4">
            <p className="font-semibold">Opción</p>
            <div className="flex gap-2 mt-2">
            {options.map((option) => (
                <button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`px-3 py-1 rounded border ${
                    selectedOption === option ? "bg-white text-black" : ""
                }`}
                >
                {option}
                </button>
            ))}
            </div>
        </div>

        <div className="mb-4">
            <p className="font-semibold">Color</p>
            <div className="flex gap-2 mt-2">
            {colors.map((color) => (
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