
import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Socilet</title>
        <meta name="description" content="Read our privacy policy at Socilet - India's first zero advance payment digital services company." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
          </motion.div>
          
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you fill out forms, correspond with us, or otherwise interact with our services. This may include your name, email address, phone number, and information about your project requirements.
            </p>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to provide and improve our services, communicate with you about your projects, and send you updates about our services when you opt-in to receive them.
            </p>
            
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as necessary to provide our services or as required by law.
            </p>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You may also request a copy of the personal data we hold about you.
            </p>
            
            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us through our website or via email.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default PrivacyPolicy;
