
import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQContent from '@/components/FAQ/FAQContent';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';

const FaqPage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - Frequently Asked Questions | Socilet</title>
        <meta name="description" content="Find answers to commonly asked questions about our services, payment terms, and delivery process at Socilet." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
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
              Find detailed answers to your questions about our services, payment terms, and delivery process.
            </p>
          </motion.div>
          
          <FAQContent />
        </section>
      </main>

      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default FaqPage;
