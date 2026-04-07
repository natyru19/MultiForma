import Link from "next/link";

type Category = {
    id: string;
    name: string;
    image: string;
};

export default function CategoryCard({ category } : { category: Category}){
    return(
        <Link href={`/categorias/${category.id}`}>
            <div>
                <p>{category.name}</p>
            </div>
            <img src={category.image} />
        </Link>
    )
}