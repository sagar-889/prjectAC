import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { type Product } from "@/data/products";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getFeaturedProducts();
      setFeaturedProducts(data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="new" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-widest text-muted-foreground mb-4 block">
            Curated Selection
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium">
            New Arrivals
          </h2>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="text-sm uppercase tracking-widest font-medium link-underline"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
