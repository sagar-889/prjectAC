import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Terms and Conditions</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-medium mb-8">
              Terms and Conditions
            </h1>

            <div className="prose prose-neutral max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: January 8, 2026</p>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">1. Introduction</h2>
                <p>Welcome to Lakshmi Collections. These Terms and Conditions govern your use of our website and the purchase of products from our online store. By accessing or using our website, you agree to be bound by these terms.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">2. Use of Website</h2>
                <p>You may use our website for lawful purposes only. You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the website in any way that violates applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>Use automated systems to access the website without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">3. Product Information</h2>
                <p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content are accurate, complete, or error-free. If a product is not as described, your sole remedy is to return it in unused condition.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">4. Pricing and Payment</h2>
                <p>All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices at any time. Payment must be received before order processing. We accept various payment methods through our secure payment gateway.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">5. Order Acceptance</h2>
                <p>Your order constitutes an offer to purchase products. We reserve the right to accept or decline your order for any reason. If we decline your order after payment, we will refund the full amount.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">6. Intellectual Property</h2>
                <p>All content on this website, including text, graphics, logos, and images, is the property of Lakshmi Collections and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written permission.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">7. Limitation of Liability</h2>
                <p>To the fullest extent permitted by law, Lakshmi Collections shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or products purchased.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">8. Governing Law</h2>
                <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City].</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">9. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">10. Contact Information</h2>
                <p>If you have questions about these Terms and Conditions, please contact us at:</p>
                <p>Email: support@lakshmicollections.com</p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsAndConditions;
