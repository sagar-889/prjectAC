import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Cancellation & Refund Policy</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-medium mb-8">
              Cancellation & Refund Policy
            </h1>

            <div className="prose prose-neutral max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: January 8, 2026</p>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Order Cancellation</h2>
                <h3 className="font-display text-xl font-medium mb-3">Before Shipment</h3>
                <p>You can cancel your order before it has been shipped at no additional cost. To cancel:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Log in to your account and go to "My Orders"</li>
                  <li>Select the order you wish to cancel</li>
                  <li>Click on "Cancel Order" and confirm</li>
                  <li>Refund will be processed within 5-7 business days</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">After Shipment</h3>
                <p>Once an order has been shipped, it cannot be cancelled. However, you may refuse delivery or initiate a return once you receive the product.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Return Policy</h2>
                <p>We accept returns within 30 days of delivery for most items. To be eligible for a return:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items must be unused and in original condition</li>
                  <li>Original tags and packaging must be intact</li>
                  <li>Items must not be worn, washed, or altered</li>
                  <li>Proof of purchase is required</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Non-Returnable Items</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Intimate apparel and swimwear</li>
                  <li>Customized or personalized items</li>
                  <li>Sale or clearance items (unless defective)</li>
                  <li>Gift cards</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Refund Process</h2>
                <h3 className="font-display text-xl font-medium mb-3">How to Initiate a Return</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact our customer service at returns@lakshmicollections.com</li>
                  <li>Provide your order number and reason for return</li>
                  <li>Receive return authorization and shipping instructions</li>
                  <li>Pack items securely with original packaging</li>
                  <li>Ship the package to our returns address</li>
                </ol>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Refund Timeline</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Once we receive your return, inspection takes 2-3 business days</li>
                  <li>Approved refunds are processed within 5-7 business days</li>
                  <li>Refund will be credited to your original payment method</li>
                  <li>Bank processing may take additional 3-5 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Exchanges</h2>
                <p>We offer exchanges for different sizes or colors of the same item, subject to availability. Exchange requests must be made within 30 days of delivery. Shipping charges for exchanges may apply.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Damaged or Defective Items</h2>
                <p>If you receive a damaged or defective item:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact us within 48 hours of delivery</li>
                  <li>Provide photos of the damage or defect</li>
                  <li>We will arrange for a replacement or full refund</li>
                  <li>Return shipping will be covered by us</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Shipping Costs</h2>
                <p>Original shipping charges are non-refundable unless the return is due to our error or a defective product. Return shipping costs are the responsibility of the customer unless otherwise specified.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">Contact Us</h2>
                <p>For questions about cancellations, returns, or refunds:</p>
                <p>Email: returns@lakshmicollections.com</p>
                <p>Phone: +91 [Your Phone Number]</p>
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

export default RefundPolicy;
