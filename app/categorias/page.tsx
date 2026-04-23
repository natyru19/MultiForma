import CategoryCard from "@/components/CategoriesSlider";

export default function CategoriasPage() {
  const categories = [
    {
      id: "1",
      name: "Llavero personalizado de auto",
      price: 350,
      image: "https://via.placeholder.com/300",
    },
    {
      id: "2",
      name: "LLaveros de auto",
      price: 500,
      image: "https://via.placeholder.com/300",
    },
    {
      id: "3",
      name: "Llaveros de animales",
      price: 800,
      image: "https://via.placeholder.com/300",
    },
    {
      id: "4",
      name: "Llavero personalizado de mascota",
      price: 600,
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-center">Nuestros llaveros</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </main>
  );
}
