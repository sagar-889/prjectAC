import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  return (
    <article
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image container */}
        <Link to={`/product/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Badges */}
            {product.is_new && (
              <span className="absolute top-4 left-4 bg-foreground text-background text-xs uppercase tracking-wider px-3 py-1">
                New
              </span>
            )}
          </div>
        </Link>

        {/* Quick action button - positioned absolutely over the image */}
        <div
          className={`absolute inset-x-0 bottom-4 px-4 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
            }`}
        >
          <Button variant="hero" className="w-full" asChild>
            <Link to={`/product/${product.id}`}>
              View Product
            </Link>
          </Button>
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 p-2 bg-background/90 backdrop-blur-sm rounded-full transition-transform duration-300 hover:scale-110"
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isLiked ? "fill-accent text-accent" : "text-foreground"}`}
          />
        </button>
      </div>

      {/* Product info */}
      <Link to={`/product/${product.id}`}>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="font-display text-lg font-medium">
            {product.name}
          </h3>
          <p className="text-muted-foreground">
            ₹{Number(product.price).toFixed(2)}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
