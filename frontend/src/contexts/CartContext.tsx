import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { Product, DEMO_PRODUCTS } from "@/data/products";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from database when user changes
  // Cart items are persisted in the database per user
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Clear local state when logged out, but items remain in database
      setItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      const data = await api.getCart();
      const cartItems: CartItem[] = data.map((item: any) => ({
        id: item.id,
        product: {
          id: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          images: item.images,
          category: item.category,
          description: "", // Fallback or could be joined
          colors: [],
          sizes: [],
          is_featured: false,
          is_new: false
        },
        quantity: item.quantity,
        size: item.size || "",
        color: item.color || "",
      }));

      setItems(cartItems);
      console.log("Cart loaded successfully:", cartItems.length, "items");
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart items");
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = async (product: Product, size: string, color: string, quantity = 1) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      window.location.href = "/auth";
      return;
    }

    // Check if item already exists with same size and color
    const existingItem = items.find(
      (item) => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      return;
    }

    try {
      const data = await api.addToCart(product.id, quantity, size, color);
      setItems((prev) => [
        ...prev,
        { id: data.id, product, quantity, size, color },
      ]);
      toast.success("Added to bag");
      openCart();
    } catch (error: any) {
      toast.error(error.message || "Failed to add item to cart");
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      await api.removeFromCart(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;

    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    try {
      await api.updateCartItem(itemId, quantity);
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update quantity");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      // Delete all items one by one
      await Promise.all(items.map(item => api.removeFromCart(item.id)));
      setItems([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to clear cart");
    }
  };

  const checkout = () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      window.location.href = "/auth";
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    closeCart();
    window.location.href = "/checkout";
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
