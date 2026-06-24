"use client";

import { useState } from "react";
import CategoryCard, { type Category } from "./CategoryCard";

type Props = {
    categories: Category[];
};

export default function CategoriesSlider({ categories }: Props) {
    const [page, setPage] = useState(0);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const start = page * itemsPerPage;
    const visibleCategories = categories.slice(start, start + itemsPerPage);

    const next = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const prev = () => {
        if (page > 0) setPage(page - 1);
    };

    return (
        <section className="bg-[var(--soft)] py-10 px-6 relative rounded-2xl">
            <h2 className="text-2xl mb-8 text-center font-bold">Categorías</h2>

            <div className="flex flex-wrap justify-center gap-10 min-h-[180px]">
                {visibleCategories.map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                ))}
            </div>

            {page > 0 && (
                <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-[var(--primary-dark)] text-white px-3 py-2 rounded-full shadow"
                    aria-label="Categorías anteriores"
                >
                    ←
                </button>
            )}

            {page < totalPages - 1 && (
                <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[var(--primary-dark)] text-white px-3 py-2 rounded-full shadow"
                    aria-label="Siguientes categorías"
                >
                    →
                </button>
            )}
        </section>
    );
}
