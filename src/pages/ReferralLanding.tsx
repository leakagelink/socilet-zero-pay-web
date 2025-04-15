
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ReferredProjectForm from '@/components/affiliate/ReferredProjectForm';

const ReferralLanding = () => {
  const { referrerId } = useParams<{ referrerId: string }>();
  const [referrerName, setReferrerName] = useState<string>("");
  
  useEffect(() => {
    // In a real implementation, this would fetch referrer info from an API
    // For demo, just set a cookie or localStorage to track the referrer
    if (referrerId) {
      localStorage.setItem('referredBy', referrerId);
      
      // For demonstration purposes, we'll pretend to look up the referrer's name
      // In a real app, this would come from an API call
      setReferrerName("Your Affiliate Partner");
    }
  }, [referrerId]);
  
  return (
    <>
      <Helmet>
        <title>Special Offer | Socilet</title>
        <meta name="description" content="Take advantage of our special offer through our affiliate program. Zero advance payment digital services." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16 bg-gray-50">
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Special Offer from {referrerName}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg">
              You've been referred by a trusted partner. Submit your project details below to get started 
              with our zero advance payment services.
            </p>
          </motion.div>
          
          <div className="my-12">
            <ReferredProjectForm referrerId={referrerId || 'unknown'} />
          </div>
          
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Socilet?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-bold mb-2">Zero Advance Payment</h3>
                <p className="text-gray-600">Pay only when you're satisfied with our completed work.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-bold mb-2">Quality Assurance</h3>
                <p className="text-gray-600">Top-notch development meeting highest industry standards.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h3 className="font-bold mb-2">Dedicated Support</h3>
                <p className="text-gray-600">Our team is always ready to assist you at every step.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default ReferralLanding;
