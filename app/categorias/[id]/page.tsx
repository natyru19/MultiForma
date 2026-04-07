type Product = {
    id: string;
    name: string;
    image: string;
    category: string;
};

const products: Product[] = [
    {
        id: "1",
        name: "Llavero de auto",
        image: "/images/llaveros.png",
        category: "llaveros",
    },
    {
        id: "2",
        name: "Llavero de animales",
        image: "/images/llaveros.png",
        category: "llaveros",
    },
    {
        id: "3",
        name: "Florero moderno",
        image: "/images/florero.png",
        category: "decoracion",
    },
    {
        id: "4",
        name: "Parlante bluetooth",
        image: "/images/parlante.png",
        category: "accesorios",
    },
];

export default async function CategoryDetail({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;

    const filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === id.toLowerCase()
    );

    if (filteredProducts.length === 0) {
        return <p className="p-6">No hay productos en esta categoría</p>;
    }

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{id}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded">
                <img src={product.image} className="w-full h-40 object-cover" />
                <p className="mt-2">{product.name}</p>
            </div>
            ))}
        </div>
        </div>
    );
}