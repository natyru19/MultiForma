import Link from "next/link";

export type Category = {
    id: string;
    name: string;
    image?: string | null;
    slug: string;
};

type Props = {
    category: Category;
    size?: "md" | "lg";
};

export default function CategoryCard({ category, size = "md" }: Props) {
    const sizeClasses =
        size === "lg"
            ? "w-36 h-36 sm:w-40 sm:h-40"
            : "w-28 h-28 sm:w-32 sm:h-32";

    return (
        <Link
            href={`/categories/${category.slug}`}
            className="group flex flex-col items-center text-center"
        >
            <div
                className={`${sizeClasses} rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-md transition-all group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center shrink-0`}
            >
                {category.image ? (
                    <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-3xl font-semibold text-gray-400 uppercase">
                        {category.name.charAt(0)}
                    </span>
                )}
            </div>

            <span className="mt-3 font-medium text-gray-800 group-hover:underline">
                {category.name}
            </span>
        </Link>
    );
}
