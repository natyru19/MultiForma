import Link from "next/link";

type Variant = {
    id: string;
    tipo: string;
    color: string;
    price: string;
    stock: number;
    image: string;
};

type Product = {
    id: string;
    name: string;
    description: string;
    image: string;
    variants: Variant[];
};

export default function ProductCard({ product }: { product: Product }) {

    const minPrice = product.variants?.length
    ? Math.min(...product.variants.map(v => Number(v.price)))
    : null;

    return (
        <Link href={`/products/${product.id}`}>
            <div className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition">

            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl"
            />

            <h2 className="text-xl font-semibold mt-4">
                {product.name}
            </h2>           
            
            <p className="text-gray-600">
                {minPrice ? `Desde $${minPrice}` : "Sin stock"}
            </p>

            <button className="mt-4 w-full bg-[var(--primary)] hover:bg-[var(--primary-light)] py-2 rounded-lg">
                Ver producto
            </button>
            </div>
        </Link>
    );
}