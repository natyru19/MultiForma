import Link from "next/link";

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
};

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/productos/${product.id}`}>
            <div className="border rounded-lg p-4 shadow-sm cursor-pointer">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                />

                <h3 className="mt-3 font-semibold">{product.name}</h3>

                <p className="text-gray-600">${product.price}</p>

                <button className="mt-3 w-full bg-black text-white py-2 rounded">
                    Ver producto
                </button>
            </div>
        </Link>
    );
}