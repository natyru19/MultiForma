type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
};

const products: Product[] = [
    {
        id: "1",
        name: "Llavero personalizado",
        price: 350,
        description: "Llavero impreso en 3D totalmente personalizado.",
        image: "https://via.placeholder.com/400",
    },
    {
        id: "2",
        name: "Soporte para celular",
        price: 500,
        description: "Soporte resistente y moderno para tu celular.",
        image: "https://via.placeholder.com/400",
    },
    {
        id: "3",
        name: "Figura decorativa",
        price: 800,
        description: "Figura decorativa impresa en 3D.",
        image: "https://via.placeholder.com/400",
    },
    {
        id: "4",
        name: "Maceta 3D",
        price: 600,
        description: "Maceta moderna para decoración.",
        image: "https://via.placeholder.com/400",
    }
];

export default async function ProductDetail({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const { id } = await params;

    const product = products.find((p) => p.id === id);

    if (!product) {
        return <p className="p-6">Producto no encontrado</p>;
    }

    return (
        <div className="p-6">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>${product.price}</p>
        </div>
    );
}