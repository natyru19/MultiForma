"use client";

import { useState } from "react";
import Link from "next/link";

type Category = {
    id: string;
    name: string;
    image: string;
    slug: string;
};

export default function CategoriesSlider({
    categories,
    }: {
    categories: Category[];
    }) {
    const [page, setPage] = useState(0);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const start = page * itemsPerPage;
    const visibleCategories = categories.slice(
        start,
        start + itemsPerPage
    );

    const next = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const prev = () => {
        if (page > 0) setPage(page - 1);
    };

    return (
        <section className="bg-grisClaro py-10 px-6 relative">
        <h2 className="text-2xl mb-6 text-center">Categorías</h2>

        <div className="flex justify-center gap-10">
            {visibleCategories.map((cat) => (
            <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="flex flex-col items-center"
            >
                <img
                src={cat.image}
                className="w-32 h-32 object-cover rounded-full shadow hover:scale-105 transition"
                />
                <span className="mt-2">{cat.name}</span>
            </Link>
            ))}
        </div>

        {page > 0 && (
            <button
            onClick={prev}
            className="absolute left-5 top-1/2 bg-piedra text-white px-3 py-2 rounded-full"
            >
            ←
            </button>
        )}

        {page < totalPages - 1 && (
            <button
            onClick={next}
            className="absolute right-5 top-1/2 bg-piedra text-white px-3 py-2 rounded-full"
            >
            →
            </button>
        )}
        </section>
    );
}