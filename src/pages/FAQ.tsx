import { Layout } from '@/components/layout/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-10 business days. Express shipping is available for 2-3 business day delivery. International orders may take 10-21 business days depending on the destination.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All transactions are secured with SSL encryption.',
  },
  {
    question: 'Are all sales final?',
    answer: 'Yes, all sales are final. We do not offer returns or refunds. Please review product details carefully before making a purchase. If you receive a damaged or defective item, please contact us within 48 hours of delivery.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive an email with tracking information. You can also track your order by logging into your account and viewing your order history.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Import duties and taxes may apply and are the responsibility of the buyer.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'You can reach our customer support team through the Contact page, by emailing support@gadgetandthread.co, or by calling (123) 456-7890 during business hours (Mon-Fri, 9am-5pm EST).',
  },
  {
    question: 'What if my item arrives damaged?',
    answer: 'If your item arrives damaged or defective, please contact us within 48 hours of delivery with photos of the damage. We will work with you to resolve the issue.',
  },
  {
    question: 'Can I change or cancel my order?',
    answer: 'Orders can only be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Please contact us immediately if you need to make changes.',
  },
];

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to common questions about our products and services.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg">
            <h2 className="font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground text-sm">
              Can't find what you're looking for? Please{' '}
              <a href="/contact" className="text-primary hover:underline">
                contact our support team
              </a>{' '}
              and we'll be happy to help.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
