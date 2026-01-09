import { Link } from 'react-router-dom';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: January 3, 2026</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to AmmaCollections ("we," "our," or "us"). We are committed to protecting your personal 
              information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website and use our services.
            </p>
            <p>
              By using our website, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Personal Information</h3>
            <p>We collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Register for an account</li>
              <li>Place an order</li>
              <li>Contact us for customer support</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address (optional)</li>
              <li>Delivery address</li>
              <li>Payment information (processed securely through Razorpay)</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information about your device, including:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
            </ul>

            <h3>2.3 Order Information</h3>
            <p>When you place an order, we collect:</p>
            <ul>
              <li>Product details and quantities</li>
              <li>Order date and time</li>
              <li>Delivery preferences</li>
              <li>Measurement details (for custom stitching)</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li><strong>Order Processing:</strong> To process and fulfill your orders, including stitching, delivery, and customer service</li>
              <li><strong>Account Management:</strong> To create and manage your account, including authentication and security</li>
              <li><strong>Communication:</strong> To send order confirmations, updates, and respond to your inquiries</li>
              <li><strong>Payment Processing:</strong> To process payments securely through our payment partner Razorpay</li>
              <li><strong>Service Improvement:</strong> To understand how our services are used and improve user experience</li>
              <li><strong>Marketing:</strong> To send promotional offers and updates (only with your consent)</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2>4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            
            <h3>4.1 Service Providers</h3>
            <ul>
              <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
              <li><strong>Delivery Partners:</strong> For order delivery and logistics</li>
              <li><strong>Cloud Services:</strong> For data storage and hosting</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose your information if required by law or in response to valid requests by public authorities.</p>

            <h3>4.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul>
              <li>Encryption of sensitive data (passwords, payment information)</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure database storage</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. While we strive to protect your 
              information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>6. Your Privacy Rights</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            </ul>
            <p>To exercise these rights, please contact us at +918247588435 or through our contact form.</p>
          </section>

          <section>
            <h2>7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small 
              files stored on your device that help us:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Keep you logged in</li>
              <li>Understand how you use our website</li>
              <li>Improve website performance</li>
            </ul>
            <p>You can control cookies through your browser settings. Disabling cookies may affect website functionality.</p>
          </section>

          <section>
            <h2>8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites (such as social media platforms or payment gateways). 
              We are not responsible for the privacy practices of these external sites. We encourage you to review their 
              privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children. If you believe we have collected information from a child, please contact us 
              immediately so we can delete it.
            </p>
          </section>

          <section>
            <h2>10. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required by law. Order information is typically retained 
              for 7 years for accounting and legal purposes.
            </p>
          </section>

          <section>
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" 
              date. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2>13. Contact Us</h2>
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <div className="contact-info">
              <p><strong>AmmaCollections</strong></p>
              <p>9-262 pallapuveedhy, sankhavaram</p>
              <p>Phone: +918247588435</p>
              <p>WhatsApp: +918247588435</p>
            </div>
          </section>

          <section className="legal-footer">
            <p>
              By using our website and services, you acknowledge that you have read and understood this Privacy Policy 
              and agree to its terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
