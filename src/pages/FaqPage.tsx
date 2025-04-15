
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import FAQ from '@/components/FAQ';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqPage = () => {
  const paymentRelatedFaqs = [
    {
      question: "Do I need to pay any advance for WordPress projects?",
      answer: "No, for WordPress projects, you don't need to pay any advance. You only pay 100% after the project is completely delivered and you're satisfied with the work. We follow a zero advance payment model for WordPress projects."
    },
    {
      question: "What payment structure do you follow for React-based projects?",
      answer: "For React and custom development projects, we require a 45% advance payment when 30% of the project work is completed. The charges vary based on the project requirements and complexity. The remaining payment is due upon successful project completion."
    },
    {
      question: "Do I need to provide my own domain?",
      answer: "Yes, clients are required to provide their own domain for all projects. This gives you complete ownership of your web presence."
    },
    {
      question: "Do you provide hosting services?",
      answer: "Yes, we provide 1 year of free hosting with every WordPress project. For other project types, hosting options can be discussed based on your requirements."
    },
    {
      question: "When do I make the final payment?",
      answer: "For WordPress projects, you make the full 100% payment only after project completion and your satisfaction. For React projects, the remaining payment (after the 45% advance) is due upon project completion."
    },
    {
      question: "Are there any hidden charges?",
      answer: "No, we maintain complete transparency in our pricing. All charges will be clearly mentioned in the project proposal, and there are no hidden fees or charges."
    }
  ];

  const affiliateProgramFaqs = [
    {
      question: "How does your affiliate program work?",
      answer: "Our affiliate program allows you to earn commissions by referring clients to us. You get a unique referral link to share, and when someone uses it to submit a project that gets completed, you earn a commission."
    },
    {
      question: "When do I receive my affiliate commission?",
      answer: "Commissions are released 21 days after the project is marked as completed. This waiting period ensures that the client is fully satisfied with the delivered work."
    },
    {
      question: "Is there a minimum payout threshold?",
      answer: "Yes, the minimum withdrawable amount is ₹500. Once you reach this threshold, you can request a payout."
    },
    {
      question: "How much commission do I earn per referral?",
      answer: "You earn 10% of the total project value for each successfully completed project that comes through your referral link."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Socilet</title>
        <meta name="description" content="Find answers to common questions about Socilet's zero advance payment services, payment terms, and affiliate program." />
      </Helmet>
      
      <Header />

      <main className="pt-24 pb-16 bg-gray-50">
        <section className="container mx-auto px-4 py-12">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg">
              Find answers to common questions about our services, payment terms, and more.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">Payment & Billing</h2>
            <Accordion type="single" collapsible className="bg-white p-6 rounded-lg shadow-sm">
              {paymentRelatedFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`payment-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6">Affiliate Program</h2>
            <Accordion type="single" collapsible className="bg-white p-6 rounded-lg shadow-sm">
              {affiliateProgramFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`affiliate-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">General Questions</h2>
            <FAQ />
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
