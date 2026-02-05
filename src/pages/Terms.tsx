import { Layout } from '@/components/layout/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="lead">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Gadget & Thread Co. ("we", "us", or "our") website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2>2. Products and Pricing</h2>
          <p>
            All products are subject to availability. We reserve the right to modify prices, discontinue products, or limit quantities at any time without prior notice. Prices displayed are in USD unless otherwise indicated.
          </p>

          <h2>3. Orders and Payment</h2>
          <ul>
            <li>All orders are subject to acceptance and availability.</li>
            <li>Payment must be made in full at the time of purchase.</li>
            <li>We accept major credit cards and other payment methods as displayed at checkout.</li>
            <li>You are responsible for ensuring payment information is accurate.</li>
          </ul>

          <h2>4. All Sales Are Final</h2>
          <p className="font-semibold">
            ALL SALES ARE FINAL. We do not offer returns, refunds, or exchanges on any purchases. Please review all product details, sizing information, and specifications carefully before placing your order.
          </p>
          <p>
            In the event you receive a damaged or defective item, please contact us within 48 hours of delivery with photos of the damage. We will review your case and determine an appropriate resolution.
          </p>

          <h2>5. Shipping</h2>
          <p>
            Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, customs, or circumstances beyond our control. Risk of loss passes to you upon delivery to the carrier.
          </p>

          <h2>6. Account Responsibilities</h2>
          <p>
            If you create an account, you are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your login credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and current information</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, and software, is the property of Gadget & Thread Co. or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our written permission.
          </p>

          <h2>8. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the site for any unlawful purpose</li>
            <li>Interfere with the site's operation or security</li>
            <li>Submit false or misleading information</li>
            <li>Engage in any form of automated data collection</li>
            <li>Harass or harm other users</li>
          </ul>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Gadget & Thread Co. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Gadget & Thread Co. and its affiliates from any claims, damages, or expenses arising from your use of our services or violation of these terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the State of [Your State], without regard to its conflict of law provisions.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the site constitutes acceptance of the modified terms.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: <a href="mailto:buisness.name.here00000@gmail.com" className="hover:text-foreground transition-colors">
                  Business Email — Expect responses in 1-3 business days</a>
            </li>
            <li>Phone: <a href="sms:+4077687484" className="hover:text-foreground transition-colors">
                  (407) 768-7484 — sms charges may apply</a>
            </li>
            <li>Address: Windermere Florida</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
