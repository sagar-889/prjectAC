import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { productService } from "@/services/productService";
import { type Product } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await productService.getProductById(id);
      setProduct(data as Product);
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Button variant="hero" onClick={() => navigate("/shop")}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      return;
    }
    if (!selectedColor) {
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const isLiked = isInWishlist(product.id);

  return (
    <>
      <Helmet>
        <title>{product.name} | Lakshmi Collections</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />

        <main className="pt-20 lg:pt-24">
          {/* Breadcrumb */}
          <div className="container mx-auto px-6 py-4">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>

          <div className="container mx-auto px-6 pb-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main image */}
                <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image badge */}
                  {product.is_new && (
                    <span className="absolute top-4 left-4 bg-foreground text-background text-xs uppercase tracking-wider px-3 py-1">
                      New
                    </span>
                  )}
                </div>

                {/* Thumbnail strip */}
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-24 bg-secondary overflow-hidden border-2 transition-colors ${selectedImage === idx ? "border-foreground" : "border-transparent"
                          }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:py-8">
                <div className="sticky top-28">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">
                    {product.category}
                  </span>
                  <h1 className="font-display text-4xl md:text-5xl font-medium mt-2 mb-4">
                    {product.name}
                  </h1>
                  <p className="text-2xl mb-6">₹{Number(product.price).toFixed(2)}</p>

                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-3 block">
                        Color: {selectedColor || "Select a color"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 text-sm border transition-colors ${selectedColor === color
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:border-foreground"
                              }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-6">
                      <label className="text-sm font-medium mb-3 block">
                        Size: {selectedSize || "Select a size"}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-12 text-sm border transition-colors ${selectedSize === size
                              ? "border-foreground bg-foreground text-background"
                              : "border-border hover:border-foreground"
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-8">
                    <label className="text-sm font-medium mb-3 block">Quantity</label>
                    <div className="flex items-center border border-border w-fit">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-secondary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-secondary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      variant="hero"
                      size="xl"
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={(product.sizes?.length > 0 && !selectedSize) || (product.colors?.length > 0 && !selectedColor)}
                    >
                      {(product.sizes?.length > 0 && !selectedSize) || (product.colors?.length > 0 && !selectedColor) ? "Select Options" : "Add to Bag"}
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-accent text-accent" : ""}`} />
                    </Button>
                  </div>

                  {/* Additional info */}
                  <div className="mt-8 pt-8 border-t border-border space-y-4 text-sm text-muted-foreground">
                    <p>✓ Free shipping on orders over ₹2000</p>
                    <p>✓ Easy 30-day returns</p>
                    <p>✓ Sustainably made</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
