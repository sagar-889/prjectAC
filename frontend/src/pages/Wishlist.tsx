import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { api } from "@/lib/api";
import { type Product } from "@/data/products";

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        setLoadingProducts(true);
        // Fetch all products and filter by wishlist IDs
        const allProducts = await api.getAllProducts('');
        const wishlistProducts = allProducts.filter((p: Product) => 
          wishlistIds.includes(p.id)
        );
        setProducts(wishlistProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [wishlistIds, user]);

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Wishlist | Lakshmi Collections</title>
        <meta name="description" content="Your saved items" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <CartSidebar />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-8 lg:py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/account" className="hover:text-foreground transition-colors">Account</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Wishlist</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-medium">
              Wishlist
            </h1>
          </div>

          <div className="container mx-auto px-6 pb-24">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-medium mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-muted-foreground mb-8">
                  Save items you love by clicking the heart icon
                </p>
                <Link to="/shop">
                  <Button variant="hero">Start Shopping</Button>
                </Link>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Wishlist;
