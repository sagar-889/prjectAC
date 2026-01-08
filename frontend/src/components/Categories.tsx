import { Link } from "react-router-dom";
import categoryWomen from "@/assets/category-women.png";
import categoryMen from "@/assets/category-men.png";

const categories = [
  {
    name: "Women",
    description: "Elegant pieces for every occasion",
    image: categoryWomen,
    href: "/shop?category=women",
  },
  {
    name: "Men",
    description: "Refined essentials for modern life",
    image: categoryMen,
    href: "/shop?category=men",
  },
];

const Categories = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative aspect-[4/3] overflow-hidden animate-slide-up"
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
