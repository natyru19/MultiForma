"use client";

import { useEffect } from "react";

type Variant = {
    id: string;
    option: string | null;
    color: string | null;
};

type Props = {
    product: {
        variants: Variant[];
    };
    selectedOption: string;
    selectedColor: string;
    setSelectedOption: (value: string) => void;
    setSelectedColor: (value: string) => void;
};

export default function VariantSelector({
    product,
    selectedOption,
    selectedColor,
    setSelectedOption,
    setSelectedColor,
}: Props) {

    const options: string[] = [
        ...new Set(
        product.variants
            .map((v) => v.option)
            .filter((opt): opt is string => !!opt && opt.trim() !== "")
        ),
    ];

    const colors: string[] = [
        ...new Set(
        product.variants
            .map((v) => v.color)
            .filter((col): col is string => !!col && col.trim() !== "")
        ),
    ];

    useEffect(() => {
        if (options.length === 1) {
        setSelectedOption(options[0]);
        }
    }, [options, setSelectedOption]);

    useEffect(() => {
        if (colors.length === 1) {
        setSelectedColor(colors[0]);
        }
    }, [colors, setSelectedColor]);

    return (
        <div className="mt-6">

        {options.length > 0 && (
            <div className="mb-4">
            <p className="font-semibold">Opción</p>
            <div className="flex gap-2 mt-2">
                {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className={`px-3 py-1 rounded border ${
                    selectedOption === option
                        ? "bg-white text-black"
                        : ""
                    }`}
                >
                    {option}
                </button>
                ))}
            </div>
            </div>
        )}

        {colors.length > 0 && (
            <div className="mb-4">
            <p className="font-semibold">Color</p>
            <div className="flex gap-2 mt-2">
                {colors.map((color) => (
                <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded border ${
                    selectedColor === color
                        ? "bg-white text-black"
                        : ""
                    }`}
                >
                    {color}
                </button>
                ))}
            </div>
            </div>
        )}
        </div>
    );
}