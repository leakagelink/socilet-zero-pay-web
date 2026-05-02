
import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SupportBar from '../components/SupportBar';
import VersionChecker from '../components/VersionChecker';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet';
import SEO from '../components/SEO';
import CacheRefresher from '../components/home/CacheRefresher';
import MainContent from '../components/home/MainContent';
import VerificationDialog from '../components/home/VerificationDialog';

const HOMEPAGE_FAQS = [
  {
    question: "What is Zero Advance Payment website development?",
    answer:
      "Zero Advance Payment means you pay nothing upfront. Socilet builds your complete website or app first, you review and test the live result, and only pay once you are 100% satisfied. We have delivered 900+ projects this way to clients in India, USA, Canada, UK and Australia.",
  },
  {
    question: "How much does a website cost with Socilet?",
    answer:
      "Business websites start at ₹14,999 (about $199 USD). E-commerce stores from ₹29,999 ($399). Mobile apps from ₹49,999 ($699). All prices include design, development, hosting setup, SEO basics and 1 month of free post-launch support — with zero advance payment required.",
  },
  {
    question: "How long does it take to build a website or app?",
    answer:
      "A standard business website is delivered in 2–4 weeks. E-commerce stores in 4–8 weeks. Mobile apps in 2–6 months depending on scope. AI spokesperson videos are delivered in 3–7 days. You only pay after you see and approve the finished work.",
  },
  {
    question: "Do you serve clients outside India?",
    answer:
      "Yes — we work with clients in the USA, Canada, UK, Australia and the UAE. We accept payments in USD, CAD, GBP, AUD and INR via PayPal, bank transfer, UPI and credit card. Communication is over WhatsApp, email and Google Meet in English or Hindi.",
  },
  {
    question: "Where is Socilet located?",
    answer:
      "Socilet is based in Ayodhya Nagar, Bhopal, Madhya Pradesh, India (PIN 462041). Reach us on WhatsApp at +91 93011 39140 or email contact@socilet.in for a free consultation.",
  },
];

const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "en-IN",
  mainEntity: HOMEPAGE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const Index = () => {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  
  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      <SEO
        title="Zero Advance Payment Web & App Development | India to USA/Canada | Socilet"
        description="No upfront payment web developer from India. 900+ projects delivered to US, Canada & India. Work first, pay later. Get professional websites, mobile apps, and AI spokesperson services."
        keywords="no upfront payment web developer, zero advance payment website development, pay after completion developer, hire Indian developer USA, app development without advance"
        canonical="/"
        image="/og-image.png"
        imageAlt="Socilet - Zero Advance Payment Web & App Development"
      >
        {/* Homepage FAQ rich-result schema (in addition to in-page <FAQ /> schema) */}
        <script type="application/ld+json">{JSON.stringify(homepageFaqSchema)}</script>
      </SEO>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Helmet>
      <Toaster position="top-right" richColors />
      <VersionChecker />
      <CacheRefresher />
      <Header />
      <main className="w-full overflow-hidden">
        <Hero />
        <MainContent />
        <VerificationDialog 
          isOpen={isVerificationDialogOpen} 
          onOpenChange={setIsVerificationDialogOpen} 
        />
      </main>
      <Footer />
      <SupportBar />
    </div>
  );
};

export default Index;
