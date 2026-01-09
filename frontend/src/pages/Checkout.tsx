import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: user?.mobile_number || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to continue with checkout");
      navigate("/auth", { state: { from: "/checkout" } });
    }
  }, [user, authLoading, navigate]);

  // Auto-fill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || prev.fullName,
        email: user.email || prev.email,
        phone: user.mobile_number || prev.phone
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          const data = await response.json();
          
          if (data.address) {
            setFormData({
              ...formData,
              address: data.address.road || data.address.suburb || "",
              city: data.address.city || data.address.town || data.address.village || "",
              state: data.address.state || "",
              zipCode: data.address.postcode || "",
              country: data.address.country || ""
            });
            toast.success("Location detected successfully!");
          } else {
            toast.error("Could not get address details");
          }
        } catch (error) {
          toast.error("Failed to get address from location");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please enable location access.");
        } else {
          toast.error("Failed to get your location");
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color
      }));

      const orderData = {
        items: orderItems,
        shipping_address: formData,
        total: Number(total) * 1.18 // 18% tax
      };

      // Navigate to payment page with order data
      navigate("/payment", { state: { orderData } });
    } catch (error: any) {
      toast.error(error.message || "Failed to proceed to payment");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout | Lakshmi Collections</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20 lg:pt-24">
            <div className="container mx-auto px-6 py-24 text-center">
              <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">Add some items to your cart before checking out</p>
              <Button variant="hero" onClick={() => navigate("/shop")}>
                Continue Shopping
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <h1 className="font-display text-4xl mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-background border border-border p-6 rounded-sm">
                    <h2 className="font-display text-xl mb-6">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fullName" className="text-sm font-medium block mb-2">Full Name *</label>
                        <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-medium block mb-2">Email *</label>
                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="phone" className="text-sm font-medium block mb-2">Phone Number *</label>
                        <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-background border border-border p-6 rounded-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl">Shipping Address</h2>
                      <Button type="button" variant="outline" size="sm" onClick={getLocation} disabled={gettingLocation} className="gap-2">
                        <MapPin className="h-4 w-4" />
                        {gettingLocation ? "Getting Location..." : "Use My Location"}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="text-sm font-medium block mb-2">Street Address *</label>
                        <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} placeholder="123 Main Street" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="text-sm font-medium block mb-2">City *</label>
                          <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} placeholder="New York" />
                        </div>
                        <div>
                          <label htmlFor="state" className="text-sm font-medium block mb-2">State/Province *</label>
                          <Input id="state" name="state" required value={formData.state} onChange={handleInputChange} placeholder="NY" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="zipCode" className="text-sm font-medium block mb-2">ZIP/Postal Code *</label>
                          <Input id="zipCode" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} placeholder="10001" />
                        </div>
                        <div>
                          <label htmlFor="country" className="text-sm font-medium block mb-2">Country *</label>
                          <Input id="country" name="country" required value={formData.country} onChange={handleInputChange} placeholder="United States" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-background border border-border p-6 rounded-sm sticky top-24">
                  <h2 className="font-display text-xl mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-20 bg-secondary rounded-sm overflow-hidden flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.color} / {item.size}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium mt-1">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${Number(total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span>${(Number(total) * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${(Number(total) * 1.18).toFixed(2)}</span>
                      </div>
                    </div>
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

export default Checkout;
