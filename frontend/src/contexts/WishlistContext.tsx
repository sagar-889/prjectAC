import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const data = await api.getWishlist();
      setWishlistIds(data);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please sign in to save items");
      return;
    }

    try {
      if (isInWishlist(productId)) {
        await api.removeFromWishlist(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await api.addToWishlist(productId);
        setWishlistIds((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, isInWishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
