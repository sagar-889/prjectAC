import { Link } from 'react-router-dom';
import './LegalPages.css';

const RefundPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <header className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Refund Policy</h1>
          <p className="last-updated">Last Updated: January 5, 2026</p>
        </header>

        <div className="legal-content">
          <section>
            <h2>1. Overview</h2>
            <p>
              At AmmaCollections, we strive to ensure your complete satisfaction with every purchase. 
              This Refund Policy outlines the conditions under which refunds are processed for products 
              purchased through our website.
            </p>
          </section>

          <section>
            <h2>2. Eligibility for Refunds</h2>
            
            <h3>2.1 Damaged or Defective Products</h3>
            <p>You are eligible for a full refund if:</p>
            <ul>
              <li>The product received is damaged during shipping</li>
              <li>The product has manufacturing defects</li>
              <li>The product received is significantly different from what was ordered</li>
              <li>The product is missing parts or accessories</li>
            </ul>
            <p>
              <strong>Time Frame:</strong> Claims must be made within 48 hours of delivery with photographic 
              evidence of the damage or defect.
            </p>

            <h3>2.2 Wrong Product Delivered</h3>
            <p>
              If you receive a product different from what you ordered, we will arrange for a replacement 
              or provide a full refund, including return shipping costs.
            </p>

            <h3>2.3 Non-Delivery</h3>
            <p>
              If your order is not delivered within the estimated delivery time and tracking shows no movement, 
              you are eligible for a full refund.
            </p>
          </section>

          <section>
            <h2>3. Non-Refundable Items</h2>
            <p>The following items are not eligible for refunds:</p>
            <ul>
              <li>Products damaged due to misuse or negligence after delivery</li>
              <li>Products with removed tags or packaging (unless defective)</li>
              <li>Customized or personalized products (unless defective)</li>
              <li>Products purchased during clearance or final sale</li>
              <li>Products returned after 7 days of delivery without valid reason</li>
            </ul>
          </section>

          <section>
            <h2>4. Refund Process</h2>
            
            <h3>4.1 How to Request a Refund</h3>
            <ol>
              <li>Contact our customer support at <strong>+918247588435</strong> or through WhatsApp</li>
              <li>Provide your order number and reason for refund</li>
              <li>Submit photos/videos of the product if claiming damage or defect</li>
              <li>Our team will review your request within 24-48 hours</li>
            </ol>

            <h3>4.2 Refund Approval</h3>
            <p>
              Once your refund request is approved, we will initiate the refund process. 
              You will receive a confirmation email with the refund details.
            </p>

            <h3>4.3 Refund Timeline</h3>
            <ul>
              <li><strong>Online Payments (UPI/Card/Net Banking):</strong> 5-7 business days</li>
              <li><strong>Cash on Delivery:</strong> Bank transfer within 7-10 business days after receiving the returned product</li>
            </ul>
            <p>
              The refund will be credited to the original payment method used during purchase. 
              For COD orders, we will require your bank account details for the refund transfer.
            </p>
          </section>

          <section>
            <h2>5. Return Shipping</h2>
            <ul>
              <li><strong>Damaged/Defective Products:</strong> We cover return shipping costs</li>
              <li><strong>Wrong Product Delivered:</strong> We cover return shipping costs</li>
              <li><strong>Change of Mind:</strong> Customer is responsible for return shipping costs (if return is accepted)</li>
            </ul>
            <p>
              We will provide a prepaid return label or arrange for pickup for eligible returns 
              where we cover the shipping costs.
            </p>
          </section>

          <section>
            <h2>6. Partial Refunds</h2>
            <p>Partial refunds may be granted in the following situations:</p>
            <ul>
              <li>Product shows signs of use beyond inspection</li>
              <li>Product is returned without original packaging</li>
              <li>Product is returned after the 7-day return window</li>
            </ul>
          </section>

          <section>
            <h2>7. Exchanges</h2>
            <p>
              We offer exchanges for defective or damaged products. If you would prefer an exchange 
              instead of a refund, please specify this when contacting customer support. 
              Exchanges are subject to product availability.
            </p>
          </section>

          <section>
            <h2>8. Contact Information</h2>
            <p>For refund-related queries, please contact us:</p>
            <ul>
              <li><strong>Phone:</strong> +918247588435</li>
              <li><strong>WhatsApp:</strong> +918247588435</li>
              <li><strong>Address:</strong> 9-262 pallapuveedhy, sankhavaram</li>
            </ul>
          </section>

          <section>
            <h2>9. Policy Updates</h2>
            <p>
              We reserve the right to update this Refund Policy at any time. Changes will be 
              effective immediately upon posting on our website. Your continued use of our services 
              after any changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>

        <footer className="legal-footer">
          <p>
            If you have any questions about our Refund Policy, please contact us at{' '}
            <a href="tel:+918247588435">+918247588435</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default RefundPolicy;
