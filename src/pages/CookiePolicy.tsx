
import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Socilet</title>
        <meta name="description" content="Read our cookie policy at Socilet - India's first zero advance payment digital services company." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg">
              This policy explains how we use cookies and similar technologies on our website.
            </p>
          </motion.div>
          
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
            
            <h2>How We Use Cookies</h2>
            <p>
              We use cookies to understand how visitors interact with our website, improve user experience, and personalize content. This includes:
            </p>
            <ul>
              <li>Essential cookies to enable basic functionality</li>
              <li>Analytics cookies to understand how visitors use our site</li>
              <li>Preference cookies to remember your settings and choices</li>
              <li>Marketing cookies to deliver relevant content and advertisements</li>
            </ul>
            
            <h2>Types of Cookies We Use</h2>
            <p>
              <strong>Necessary cookies:</strong> These are essential for the website to function properly and cannot be disabled in our systems.
            </p>
            <p>
              <strong>Performance cookies:</strong> These help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <p>
              <strong>Functional cookies:</strong> These enable enhanced functionality and personalization, such as remembering your preferences.
            </p>
            <p>
              <strong>Targeting cookies:</strong> These may be set through our site by our advertising partners to build a profile of your interests.
            </p>
            
            <h2>Managing Cookies</h2>
            <p>
              You can control and manage cookies in various ways. Most web browsers allow you to manage your cookie preferences. You can:
            </p>
            <ul>
              <li>Delete cookies from your device</li>
              <li>Block cookies by activating the setting on your browser</li>
              <li>Choose to block all or some cookies</li>
            </ul>
            <p>
              Please note that if you choose to block cookies, you may not be able to use all the features of our website.
            </p>
            
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us through our website or via email.
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

export default CookiePolicy;
