import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Package, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import { Button } from "../components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !authLoading) {
      navigate("/auth");
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getUserOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground uppercase tracking-widest">Loading orders...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Orders | Lakshmi Collections</title>
        <meta name="description" content="View your order history" />
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
              <span className="text-foreground">Orders</span>
            </nav>
            <h1 className="font-display text-4xl md:text-5xl font-medium">
              Order History
            </h1>
          </div>

          <div className="container mx-auto px-6 pb-24">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-medium mb-2">
                  No orders yet
                </h2>
                <p className="text-muted-foreground mb-8">
                  When you place an order, it will appear here
                </p>
                <Link to="/shop">
                  <Button variant="hero">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border p-6 rounded-sm hover:shadow-soft transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Order Reference</p>
                        <h3 className="font-medium">{order.id.slice(0, 8).toUpperCase()}</h3>
                      </div>
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Date</p>
                          <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Total</p>
                          <p className="font-medium">₹{Number(order.total).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Status</p>
                          <span className="inline-block px-3 py-1 bg-secondary text-xs font-bold uppercase tracking-widest rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-secondary/30 p-2 rounded-sm pr-4">
                          <img
                            src={item.products?.images?.[0]}
                            alt={item.products?.name}
                            className="w-12 h-16 object-cover bg-secondary"
                          />
                          <div>
                            <p className="text-xs font-medium truncate max-w-[120px]">{item.products?.name}</p>
                            <p className="text-[10px] text-muted-foreground font-body">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Orders;
