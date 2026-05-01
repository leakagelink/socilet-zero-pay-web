import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle, CreditCard, Users, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';

type Faq = { question: string; answer: string };

const paymentRelatedFaqs: Faq[] = [
  {
    question: "Do I need to pay any advance for WordPress projects?",
    answer:
      "No. For WordPress projects, you don't pay any advance. You only pay 100% after the project is completely delivered and you're satisfied with the work. This is the core of our zero advance payment model.",
  },
  {
    question: "What payment structure do you follow for React-based projects?",
    answer:
      "For React and custom development projects, we ask for a 45% milestone payment when 30% of the work is completed. The remaining balance is due upon successful project completion. Final pricing depends on requirements and complexity.",
  },
  {
    question: "Do I need to provide my own domain?",
    answer:
      "Yes. Clients provide their own domain so they retain full ownership of their web presence. We can help you purchase one if needed.",
  },
  {
    question: "Do you provide hosting services?",
    answer:
      "We include 1 year of free hosting with every WordPress project. For React and custom apps, hosting options are discussed during the proposal — we can deploy to your account or recommend cost-effective providers.",
  },
  {
    question: "When do I make the final payment?",
    answer:
      "For WordPress projects, the full 100% is paid only after project completion and your written approval. For React projects, the remaining balance (after the 45% milestone) is due on completion.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No. Every charge is itemised in the project proposal before work begins. There are no setup fees, no hidden taxes beyond statutory GST, and no surprise invoices.",
  },
];

const affiliateProgramFaqs: Faq[] = [
  {
    question: "How does Socilet's affiliate program work?",
    answer:
      "You receive a unique referral link from your affiliate dashboard. Share it with anyone who needs digital services — when they sign up and the project is completed, you earn a commission automatically tracked in your account.",
  },
  {
    question: "When do I receive my affiliate commission?",
    answer:
      "Commissions are released 21 days after the referred project is marked completed. This buffer ensures the client is fully satisfied and protects both sides from refunds or disputes.",
  },
  {
    question: "Is there a minimum payout threshold?",
    answer:
      "Yes — the minimum withdrawable balance is ₹500. Once you reach it, you can request a payout to your bank account or UPI ID directly from the affiliate dashboard.",
  },
  {
    question: "How much commission do I earn per referral?",
    answer:
      "You earn 10% of the total project value for every successfully completed referral. Commissions are calculated on the final invoice amount, excluding GST.",
  },
];

const generalFaqs: Faq[] = [
  {
    question: "What digital services does Socilet offer?",
    answer:
      "We offer website development, mobile app development, AI spokesperson video creation, SEO services, Google Ads management, social media marketing, and business profile (Google My Business) listing — all available under the zero advance payment model.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Supabase, Python, PHP/Laravel, WordPress. Mobile: React Native, Flutter, native iOS/Android. Hosting: Vercel, AWS, DigitalOcean, Cloudflare.",
  },
  {
    question: "How long does it take to complete a project?",
    answer:
      "Standard business websites take 2–4 weeks. E-commerce stores take 4–8 weeks. Mobile apps typically take 2–6 months depending on scope. AI spokesperson videos are delivered in 3–7 days.",
  },
  {
    question: "Do you provide ongoing support after delivery?",
    answer:
      "Yes — every project includes 1 month of free post-launch support for bug fixes. After that we offer affordable monthly maintenance packages covering hosting, security, content updates and feature additions.",
  },
  {
    question: "Where is Socilet located?",
    answer:
      "Socilet is based in Ayodhya Nagar, Bhopal, Madhya Pradesh, India (PIN 462041). We serve clients across India and internationally in the USA, Canada, UK, Australia and the UAE.",
  },
  {
    question: "How do I get started?",
    answer:
      "Reach out via the contact form on socilet.in, WhatsApp +91 93011 39140, or email contact@socilet.in. We'll schedule a free consultation and share a detailed proposal within 24–48 hours.",
  },
];

const FaqGroup: React.FC<{
  title: string;
  icon: React.ReactNode;
  faqs: Faq[];
  idPrefix: string;
  defaultOpenCount?: number;
}> = ({ title, icon, faqs, idPrefix, defaultOpenCount = 2 }) => (
  <div className="max-w-3xl mx-auto mb-14">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-primary-100 p-3 rounded-full">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>

    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={`${idPrefix}-${index}`}
          open={index < defaultOpenCount}
          className="group border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow [&_summary::-webkit-details-marker]:hidden"
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
        >
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-base md:text-lg text-gray-900">
            <span itemProp="name">{faq.question}</span>
            <ChevronDown className="w-5 h-5 text-primary-600 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div
            className="px-5 pb-5 text-gray-700 leading-relaxed"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <p itemProp="text">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  </div>
);

const FaqPage: React.FC = () => {
  const allFaqs: Faq[] = [...paymentRelatedFaqs, ...affiliateProgramFaqs, ...generalFaqs];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://socilet.in" },
      { "@type": "ListItem", position: 2, name: "FAQ", item: "https://socilet.in/faq" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>FAQ — Zero Advance Payment, Pricing & Affiliate Program | Socilet</title>
        <meta
          name="description"
          content="Answers to common questions about Socilet's zero advance payment model, WordPress & React pricing, project timelines, hosting, support and the 10% affiliate commission program."
        />
        <link rel="canonical" href="https://socilet.in/faq" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <section className="container mx-auto px-4 py-12">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full" />
            <p className="text-gray-600 text-lg">
              Everything you need to know about our zero advance payment model, pricing,
              timelines, and affiliate program — answered clearly.
            </p>
          </motion.div>

          <FaqGroup
            title="Payment & Billing"
            icon={<CreditCard className="w-6 h-6 text-primary-600" />}
            faqs={paymentRelatedFaqs}
            idPrefix="payment"
          />

          <FaqGroup
            title="Affiliate Program"
            icon={<Users className="w-6 h-6 text-primary-600" />}
            faqs={affiliateProgramFaqs}
            idPrefix="affiliate"
          />

          <FaqGroup
            title="General Questions"
            icon={<HelpCircle className="w-6 h-6 text-primary-600" />}
            faqs={generalFaqs}
            idPrefix="general"
          />

          <div className="max-w-3xl mx-auto mt-16 bg-gradient-to-r from-primary-50 to-blue-50 p-6 md:p-8 rounded-xl text-center border border-primary-100">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Still have questions?</h3>
            <p className="text-gray-600 mb-5">
              Reach out and our team will respond within a few business hours.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default FaqPage;
