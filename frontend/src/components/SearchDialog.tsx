import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DEMO_PRODUCTS, CATEGORIES } from "@/data/products";
import { Slider } from "@/components/ui/slider";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = DEMO_PRODUCTS.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesQuery && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "newest") return b.is_new ? 1 : -1;
    return 0;
  });

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onOpenChange(false);
    setQuery("");
  };

  const handleViewAll = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("sort", sortBy);
    navigate(`/shop?${params.toString()}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <div className="p-6 border-b border-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-input"
              name="search"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg bg-secondary border-0"
              autoFocus
            />
            {query && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${selectedCategory === cat
                        ? "bg-foreground text-background"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={500}
                step={10}
                className="mt-4"
              />
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="search-sort" className="text-sm font-medium mb-2 block">Sort By</label>
              <select
                id="search-sort"
                name="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-10 px-3 bg-secondary border-0 rounded-sm text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[50vh] p-6">
          {filteredProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={handleViewAll}
                  className="text-sm font-medium link-underline"
                >
                  View all in Shop
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.slice(0, 6).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="text-left group"
                  >
                    <div className="aspect-[3/4] bg-secondary overflow-hidden mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
