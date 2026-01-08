import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Shipping & Exchange Policy | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Shipping & Exchange Policy</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-medium mb-8">
              Shipping & Exchange Policy
            </h1>

            <div className="prose prose-neutral max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: January 8, 2026</p>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Shipping Information</h2>
                
                <h3 className="font-display text-xl font-medium mb-3">Delivery Areas</h3>
                <p>We currently ship to all locations within India. International shipping is not available at this time.</p>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Shipping Charges</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Free shipping on orders above ₹2,000</li>
                  <li>₹99 flat shipping fee for orders below ₹2,000</li>
                  <li>Express shipping available for ₹199 (1-2 business days)</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Processing Time</h3>
                <p>Orders are typically processed within 1-2 business days (Monday-Saturday, excluding public holidays). You will receive a confirmation email once your order has been shipped with tracking information.</p>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Delivery Time</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Metro cities: 3-5 business days</li>
                  <li>Other cities: 5-7 business days</li>
                  <li>Remote areas: 7-10 business days</li>
                  <li>Express shipping: 1-2 business days (metro cities only)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Order Tracking</h2>
                <p>Once your order is shipped, you will receive:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Shipping confirmation email with tracking number</li>
                  <li>SMS updates on delivery status</li>
                  <li>Real-time tracking through "My Orders" section</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Shipping Partners</h2>
                <p>We work with trusted courier partners including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Blue Dart</li>
                  <li>Delhivery</li>
                  <li>FedEx</li>
                  <li>India Post</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Delivery Issues</h2>
                
                <h3 className="font-display text-xl font-medium mb-3">Failed Delivery Attempts</h3>
                <p>If delivery fails due to incorrect address or unavailability:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Courier will make 2-3 delivery attempts</li>
                  <li>You will be contacted via phone/SMS</li>
                  <li>Package will be held at local courier office for 7 days</li>
                  <li>After 7 days, package will be returned to us</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Lost or Damaged Packages</h3>
                <p>If your package is lost or arrives damaged:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact us immediately at shipping@lakshmicollections.com</li>
                  <li>Provide order number and photos (if damaged)</li>
                  <li>We will investigate and arrange replacement or refund</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Exchange Policy</h2>
                
                <h3 className="font-display text-xl font-medium mb-3">Size/Color Exchange</h3>
                <p>We offer hassle-free exchanges for size or color within 30 days of delivery:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Item must be unused with original tags</li>
                  <li>Subject to availability of requested size/color</li>
                  <li>First exchange is free (we cover shipping)</li>
                  <li>Subsequent exchanges may incur shipping charges</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">How to Request an Exchange</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Log in to your account and go to "My Orders"</li>
                  <li>Select the item you want to exchange</li>
                  <li>Choose "Exchange" and select new size/color</li>
                  <li>Schedule pickup or drop at nearest courier center</li>
                  <li>New item will be shipped once we receive the return</li>
                </ol>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Exchange Timeline</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Pickup/return: 2-3 business days</li>
                  <li>Quality check: 1-2 business days</li>
                  <li>New item dispatch: 1-2 business days</li>
                  <li>Delivery: 3-7 business days</li>
                  <li>Total time: 7-14 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">International Orders</h2>
                <p>We currently do not ship internationally. We are working on expanding our services and will update this policy once international shipping becomes available.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Contact Us</h2>
                <p>For shipping or exchange queries:</p>
                <p>Email: shipping@lakshmicollections.com</p>
                <p>Phone: +91 [Your Phone Number]</p>
                <p>WhatsApp: +91 [Your WhatsApp Number]</p>
                <p>Hours: Monday-Saturday, 10 AM - 6 PM IST</p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ShippingPolicy;
