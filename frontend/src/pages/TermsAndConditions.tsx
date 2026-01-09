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
                <h2 className="font-display text-2xl font-medium mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using Lakshmi Collections website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">2. Use of Website</h2>
                <h3 className="font-display text-xl font-medium mb-3">Eligibility</h3>
                <p>You must be at least 18 years old to make purchases on our website. By placing an order, you confirm that you are of legal age.</p>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Account Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Prohibited Activities</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the website for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect or harvest information about other users</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">3. Products and Pricing</h2>
                <h3 className="font-display text-xl font-medium mb-3">Product Information</h3>
                <p>We strive to provide accurate product descriptions and images. However:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Colors may vary slightly due to screen settings</li>
                  <li>We reserve the right to correct errors in product information</li>
                  <li>Product availability is subject to change without notice</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Pricing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All prices are in Indian Rupees (INR)</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to correct pricing errors</li>
                  <li>Applicable taxes will be added at checkout</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">4. Orders and Payment</h2>
                <h3 className="font-display text-xl font-medium mb-3">Order Acceptance</h3>
                <p>Your order is an offer to purchase products. We reserve the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accept or decline any order</li>
                  <li>Limit quantities purchased</li>
                  <li>Cancel orders due to pricing errors or product unavailability</li>
                </ul>

                <h3 className="font-display text-xl font-medium mb-3 mt-6">Payment</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment must be received before order processing</li>
                  <li>We accept UPI, credit/debit cards, and net banking</li>
                  <li>All transactions are processed securely through Razorpay</li>
                  <li>You authorize us to charge your payment method for the total amount</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">5. Shipping and Delivery</h2>
                <p>Shipping and delivery terms are governed by our Shipping Policy. Delivery times are estimates and not guaranteed. We are not liable for delays caused by courier services or circumstances beyond our control.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">6. Returns and Refunds</h2>
                <p>Returns and refunds are subject to our Cancellation & Refund Policy. Please review the policy before making a purchase.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">7. Intellectual Property</h2>
                <p>All content on this website, including text, images, logos, and designs, is the property of Lakshmi Collections and protected by copyright laws. You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reproduce, distribute, or modify any content without permission</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Create derivative works from our content</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">8. Limitation of Liability</h2>
                <p>To the fullest extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount paid for the product</li>
                  <li>We do not guarantee uninterrupted or error-free website operation</li>
                  <li>We are not responsible for third-party content or links</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">9. Indemnification</h2>
                <p>You agree to indemnify and hold Lakshmi Collections harmless from any claims, damages, or expenses arising from your use of the website or violation of these terms.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">10. Privacy</h2>
                <p>Your use of our website is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect and use your information.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">11. Modifications</h2>
                <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">12. Governing Law</h2>
                <p>These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City], India.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">13. Severability</h2>
                <p>If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">14. Contact Information</h2>
                <p>For questions about these Terms and Conditions, please contact us at:</p>
                <p>Email: support@lakshmicollections.com</p>
                <p>Phone: +91 [Your Phone Number]</p>
                <p>Address: [Your Business Address]</p>
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
