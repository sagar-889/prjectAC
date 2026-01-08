import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, type Product } from "@/data/products";
import { productService } from "@/services/productService";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "500");
  const sortBy = searchParams.get("sort") || "newest";
  const filter = searchParams.get("filter") || "";

  const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [query, category, minPrice, maxPrice, sortBy, filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts({
        category,
        minPrice,
        maxPrice,
        sortBy,
        query,
        isNew: filter === "new"
      });
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products;

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const applyPriceRange = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("minPrice", localPriceRange[0].toString());
    newParams.set("maxPrice", localPriceRange[1].toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalPriceRange([0, 500]);
  };

  const hasActiveFilters = query || category !== "All" || minPrice > 0 || maxPrice < 500 || filter;

  return (
    <>
      <Helmet>
        <title>Shop | Lakshmi Collections</title>
        <meta name="description" content="Browse our curated collection of timeless fashion pieces." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />

        <main className="pt-20 lg:pt-24">
          {/* Page header */}
          <div className="container mx-auto px-6 py-8 lg:py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Shop</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-medium">
              {filter === "new" ? "New Arrivals" : category !== "All" ? category : "All Products"}
            </h1>
            {query && (
              <p className="text-muted-foreground mt-2">
                Search results for "{query}"
              </p>
            )}
          </div>

          <div className="container mx-auto px-6 pb-24">
            <div className="flex gap-12">
              {/* Desktop Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-28 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Filters</h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Category filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => updateFilter("category", cat)}
                          className={`block text-sm transition-colors ${(category === cat || (cat === "All" && !category))
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">
                      Price: ${localPriceRange[0]} - ${localPriceRange[1]}
                    </h4>
                    <Slider
                      value={localPriceRange}
                      onValueChange={setLocalPriceRange}
                      onValueCommit={applyPriceRange}
                      min={0}
                      max={500}
                      step={10}
                    />
                  </div>

                  {/* Sort */}
                  <div>
                    <label htmlFor="shop-sort" className="text-sm font-medium mb-3 block">Sort By</label>
                    <select
                      id="shop-sort"
                      name="sort"
                      value={sortBy}
                      onChange={(e) => updateFilter("sort", e.target.value)}
                      className="w-full h-10 px-3 bg-secondary border-0 rounded-sm text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <div className="flex-1">
                {/* Mobile filter button */}
                <div className="lg:hidden flex justify-between items-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Results count - desktop */}
                <p className="hidden lg:block text-sm text-muted-foreground mb-6">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>

                {/* Products grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">No products found</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile filter drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background p-6 overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-xl font-medium">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Category filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          updateFilter("category", cat);
                        }}
                        className={`px-4 py-2 text-sm border transition-colors ${(category === cat || (cat === "All" && !category))
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Price: ${localPriceRange[0]} - ${localPriceRange[1]}
                  </h4>
                  <Slider
                    value={localPriceRange}
                    onValueChange={setLocalPriceRange}
                    min={0}
                    max={500}
                    step={10}
                  />
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="mobile-shop-sort" className="text-sm font-medium mb-3 block">Sort By</label>
                  <select
                    id="mobile-shop-sort"
                    name="sort"
                    value={sortBy}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="w-full h-12 px-4 bg-secondary border-0 rounded-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                >
                  Clear All
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={() => {
                    applyPriceRange();
                    setIsFilterOpen(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Shop;
