import React from 'react';
import { motion } from "framer-motion";
import { MessageCircle, HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What digital services does Socilet offer?",
    answer:
      "Socilet offers website development, mobile app development (React Native, Flutter, native iOS/Android), AI spokesperson video creation, business profile listing (Google My Business setup), SEO services, social media marketing, and Google Ads management. All services are available under our zero advance payment model for eligible projects.",
  },
  {
    question: "How does Socilet's zero advance payment model work?",
    answer:
      "With our zero advance payment model, WordPress website clients pay 100% only after the project is completely delivered and approved. For React-based custom projects, we ask for a 45% milestone payment after 30% of the work is completed. There are no hidden fees, and you only pay when you are satisfied with the deliverable.",
  },
  {
    question: "Where is Socilet located and which areas do you serve?",
    answer:
      "Socilet is based in Ayodhya Nagar, Bhopal, Madhya Pradesh, India (PIN 462041). We serve clients across Bhopal, Indore, Jabalpur and the rest of India, plus international clients in the USA, Canada, UK, Australia and the UAE.",
  },
  {
    question: "What technologies do you use for development?",
    answer:
      "For frontend we use React, Next.js, Vue.js and Angular. For backend we use Node.js, Python (FastAPI/Django) and PHP (Laravel/WordPress). For mobile apps we work with React Native, Flutter and native iOS/Android. We also offer AI integrations using Gemini and OpenAI models.",
  },
  {
    question: "How long does it take to complete a typical project?",
    answer:
      "A standard business website takes 2–4 weeks. E-commerce stores take 4–8 weeks. Mobile apps typically take 2–6 months depending on complexity. AI spokesperson videos are delivered within 3–7 days. Every project starts with a detailed timeline shared during the free consultation.",
  },
  {
    question: "Do you provide ongoing support and maintenance after delivery?",
    answer:
      "Yes. Every project includes 30 days of free post-launch bug-fix support. After that we offer affordable monthly maintenance packages that cover hosting management, security updates, content updates, performance monitoring and feature additions.",
  },
  {
    question: "Who provides the domain and hosting for the project?",
    answer:
      "Clients provide their own domain. For WordPress projects we include 1 year of free hosting. For React-based and custom projects, hosting is discussed during the proposal — we can either deploy on your hosting account or recommend cost-effective providers.",
  },
  {
    question: "How much does a website or app cost in India?",
    answer:
      "A basic business website starts at ₹15,000. E-commerce websites start at ₹35,000. Custom React web apps typically range from ₹50,000 to ₹3,00,000. Mobile apps start at ₹60,000 and go up based on features. All pricing is in INR with transparent, fixed quotations.",
  },
  {
    question: "What happens if I am not satisfied with the delivered work?",
    answer:
      "We work in iterative milestones with continuous client feedback. If you're not satisfied with any deliverable, we revise it free of charge until you approve. Final payment is only collected after written approval, which is the core promise of our zero advance model.",
  },
  {
    question: "How do I get started with Socilet?",
    answer:
      "Contact us via the form on socilet.in, WhatsApp us at +91 93011 39140, or email contact@socilet.in. We respond within a few business hours, schedule a free consultation, and share a detailed proposal with timeline and pricing within 24–48 hours.",
  },
];

const FAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section id="faq" className="section-padding bg-white relative">
      {/* FAQPage JSON-LD for rich results & LLM extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <motion.div
        className="absolute top-0 right-0 w-72 h-72 bg-primary-50 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          transition: { duration: 8, repeat: Infinity },
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex justify-center mb-3">
            <div className="bg-primary-100 p-3 rounded-full">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h2 id="faq-heading" className="text-4xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full" />
          <p className="text-gray-600">
            Clear answers about our services, pricing, timelines, and zero advance payment model.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <details
              key={index}
              // First 3 open by default so answers are visible to crawlers/users without interaction
              open={index < 3}
              className="group border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow [&_summary::-webkit-details-marker]:hidden"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-semibold text-lg text-gray-900">
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
        </motion.div>

        <motion.div
          className="mt-12 bg-gradient-to-r from-primary-50 to-blue-50 p-6 md:p-8 rounded-xl text-center max-w-3xl mx-auto border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-md">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-5">
            Couldn't find what you were looking for? Reach out and we'll respond within a few hours.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
