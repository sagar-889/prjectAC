import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  const orderData = location.state?.orderData;
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!orderData) {
      navigate("/checkout");
      return;
    }

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [orderData, navigate]);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Create order and get Razorpay order ID
      const { order, razorpayOrder } = await api.createOrder(orderData);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Lakshmi Collections",
        description: "Payment for your order",
        image: "/favicon.ico",
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id
            });

            // Clear cart
            await clearCart();

            setPaymentSuccess(true);
            toast.success("Payment successful!");

            // Redirect to orders page after 2 seconds
            setTimeout(() => {
              navigate("/orders");
            }, 2000);
          } catch (error: any) {
            toast.error("Payment verification failed: " + error.message);
            setProcessing(false);
          }
        },
        prefill: {
          name: orderData.shipping_address.fullName,
          email: orderData.shipping_address.email,
          contact: orderData.shipping_address.phone,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi'
                  }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.error("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (!orderData) {
    return null;
  }

  if (paymentSuccess) {
    return (
      <>
        <Helmet>
          <title>Payment Successful | Lakshmi Collections</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="font-display text-3xl mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-4">Your order has been placed successfully.</p>
            <p className="text-sm text-muted-foreground">Redirecting to orders...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <h1 className="font-display text-4xl mb-8">Payment</h1>

            <div className="max-w-2xl mx-auto">
              {/* Order Summary */}
              <div className="bg-background border border-border p-6 rounded-sm mb-6">
                <h2 className="font-display text-xl mb-6">Order Summary</h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span>{orderData.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{(orderData.total / 1.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>₹{(orderData.total - orderData.total / 1.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>₹{orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Pay ₹${orderData.total.toFixed(2)}`}
                </Button>

                <div className="text-sm text-muted-foreground text-center mt-4">
                  <p>🔒 Secure payment powered by Razorpay</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 text-center">
                <p>✓ 100% secure payment</p>
                <p>✓ Multiple payment options</p>
                <p>✓ Instant confirmation</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Payment;
