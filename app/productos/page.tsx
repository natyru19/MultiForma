import ProductCard from "@/components/ProductCard";

export default function ProductosPage() {
    const products = [
        {
            id: "1",
            name: "Llavero personalizado",
            price: 350,
            image: "https://via.placeholder.com/300",
        },
        {
            id: "2",
            name: "Soporte para celular",
            price: 500,
            image: "https://via.placeholder.com/300",
        },
        {
            id: "3",
            name: "Figura decorativa",
            price: 800,
            image: "https://via.placeholder.com/300",
        },
        {
            id:"4",
            name: "Maceta 3D",
            price: 600,
            image: "https://via.placeholder.com/300",
        },
    ];

    return (
        <main className="p-6">
        <h1 className="text-3xl font-bold text-center">
            Nuestros productos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {products.map((product, index) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        </main>
    );
}