
import React from 'react';
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportBar from '@/components/SupportBar';
import WhatsAppButton from '@/components/WhatsAppButton';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Socilet</title>
        <meta name="description" content="Read our terms of service at Socilet - India's first zero advance payment digital services company." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 text-lg">
              Please read these terms and conditions carefully before using our services.
            </p>
          </motion.div>
          
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>Payment Terms</h2>
            
            <h3>WordPress Projects</h3>
            <p>
              For WordPress projects, the following payment terms apply:
            </p>
            <ul>
              <li>No advance payment is required.</li>
              <li>100% payment is due only after complete project delivery and client satisfaction.</li>
              <li>No interim payments are required during project development.</li>
              <li>Clients are required to provide their own domain.</li>
              <li>We provide 1 year of free hosting with every WordPress project.</li>
            </ul>
            
            <h3>React Projects</h3>
            <p>
              For React and custom development projects, the following payment terms apply:
            </p>
            <ul>
              <li>45% advance payment is required when 30% of project work is completed.</li>
              <li>Project charges vary based on project requirements and complexity.</li>
              <li>Remaining payment is due upon project completion.</li>
            </ul>
            
            <h2>Service Terms</h2>
            <p>
              By accessing our website or using our services, you agree to be bound by these terms and conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
            
            <h3>Project Delivery</h3>
            <p>
              We strive to deliver all projects within agreed timelines. However, timelines may vary based on project complexity and client feedback cycles. We will keep you informed about project progress at regular intervals.
            </p>
            
            <h3>Revisions and Feedback</h3>
            <p>
              We offer a reasonable number of revisions as part of our service. Specific revision terms will be outlined in your project contract. Major changes outside the original scope may incur additional charges.
            </p>
            
            <h2>Affiliate Program</h2>
            <p>
              Our affiliate program allows partners to earn commissions by referring clients to our services. When a client you refer completes a project with us, you earn a commission on the project value. Commissions are released 21 days after project completion.
            </p>
            
            <h2>Modifications to Terms</h2>
            <p>
              Socilet reserves the right to revise these terms at any time without notice. By using this website, you are agreeing to be bound by the current version of these terms of service.
            </p>
            
            <h2>Contact Information</h2>
            <p>
              If you have any questions about these terms, please contact us through our website or via email.
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

export default TermsOfService;
