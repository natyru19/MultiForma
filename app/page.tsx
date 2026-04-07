import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";

export default function Home() {

  const categories = [
    { id: "llaveros", name: "Llaveros", image: "/images/llaveros.png" },
    { id: "decoracion", name: "Florero", image: "/images/florero.png" },
    { id: "accesorios", name: "Parlante", image: "/images/parlante.png" },
  ];

  const products = [
    {
      id: "1",
      name: "Llavero personalizado",
      price: 350,
      category: "llaveros",
      image: "https://via.placeholder.com/300",
    },
    {
      id: "2",
      name: "Soporte para celular",
      price: 500,
      category: "accesorios",
      image: "https://via.placeholder.com/300",
    },
    {
      id: "3",
      name: "Figura decorativa",
      price: 800,
      category: "decoracion",
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <main className="p-6 text-center">
      <section className="mt-10">
        <h1 className="text-3xl font-bold">
          Impresión 3D personalizada
        </h1>

        <p className="mt-4">
          Creamos lo que imagines
        </p>

        <button className="mt-6 bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded">
          Registrate y obtené 10% OFF
        </button>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center">Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center">
          Productos destacados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}