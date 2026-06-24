import CategoryCard, { type Category } from "./CategoryCard";

type Props = {
    categories: Category[];
};

export default function CategoryGrid({ categories }: Props) {
    if (categories.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-10">
                No hay categorías disponibles.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10 mt-10 justify-items-center">
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} size="lg" />
            ))}
        </div>
    );
}
