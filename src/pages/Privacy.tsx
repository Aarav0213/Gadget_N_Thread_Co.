import { Layout } from '@/components/layout/Layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="lead">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes:
          </p>
          <ul>
            <li>Name and contact information (email, phone number, shipping address)</li>
            <li>Payment information (processed securely through our payment provider)</li>
            <li>Order history and preferences</li>
            <li>Communications with our support team</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Respond to your questions and requests</li>
            <li>Improve our products and services</li>
            <li>Send promotional communications (with your consent)</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information with:
          </p>
          <ul>
            <li>Service providers who assist in order fulfillment and shipping</li>
            <li>Payment processors to complete transactions</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. All payment transactions are encrypted using SSL technology. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>5. Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and update your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>

          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@gadgetandthread.co</li>
            <li>Phone: (123) 456-7890</li>
            <li>Address: 123 Commerce Street, City, State 12345</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
