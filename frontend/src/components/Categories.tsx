import { Link } from "react-router-dom";
import categoryWomen from "@/assets/category-women.png";

const categories = [
  {
    name: "Women's Collection",
    description: "Elegant pieces for every occasion",
    image: categoryWomen,
    href: "/shop?category=women",
  },
];

const Categories = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[16/9] overflow-hidden animate-slide-up block"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Background image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-foreground/30 transition-opacity duration-300 group-hover:bg-foreground/40" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
                <h3 className="font-display text-3xl lg:text-4xl font-medium text-background mb-2">
                  {category.name}
                </h3>
                <p className="text-background/80 text-sm lg:text-base">
                  {category.description}
                </p>
                <span className="mt-4 text-xs uppercase tracking-widest text-background/90 font-medium">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
