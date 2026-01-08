import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Lakshmi Collections</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-6 py-12">
            <nav className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Privacy Policy</span>
            </nav>

            <h1 className="font-display text-4xl md:text-5xl font-medium mb-8">
              Privacy Policy
            </h1>

            <div className="prose prose-neutral max-w-none space-y-6">
              <p className="text-muted-foreground">Last updated: January 8, 2026</p>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">1. Information We Collect</h2>
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number, and shipping address</li>
                  <li>Payment information (processed securely through our payment gateway)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our customer service team</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Detect and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">3. Information Sharing</h2>
                <p>We do not sell your personal information. We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service providers who assist in order fulfillment and delivery</li>
                  <li>Payment processors for secure transaction processing</li>
                  <li>Law enforcement when required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">4. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">5. Cookies and Tracking</h2>
                <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookies through your browser settings.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">7. Children's Privacy</h2>
                <p>Our website is not intended for children under 18 years of age. We do not knowingly collect personal information from children.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">8. Changes to Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</p>
              </section>

              <section>
                <h2 className="font-display text-2xl font-medium mb-4">9. Contact Us</h2>
                <p>If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:</p>
                <p>Email: privacy@lakshmicollections.com</p>
                <p>Phone: +91 [Your Phone Number]</p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
