
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
              Please read these terms carefully before using our services.
            </p>
          </motion.div>
          
          <div className="prose prose-lg max-w-4xl mx-auto">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Socilet's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
            
            <h2>2. Project Payment Terms</h2>
            
            <h3>2.1 WordPress Projects</h3>
            <p>
              For WordPress projects, we follow a zero advance payment model. Clients are only required to make 100% payment after the project is fully complete and delivered. No interim payments are required during the development process.
            </p>
            <p>
              <strong>Domain and Hosting:</strong> Clients are required to provide their own domain. Socilet provides 1 year of free hosting with all WordPress projects.
            </p>
            
            <h3>2.2 React Projects</h3>
            <p>
              For React projects, a payment of 45% is required when 30% of the project work is completed. The charges are based on the specific requirements and scope of each project.
            </p>
            
            <h2>3. Service Description</h2>
            <p>
              Socilet provides digital services including but not limited to website development, app development, AI spokesperson creation, and business profile listing. The specific deliverables for each project will be outlined in a project agreement.
            </p>
            
            <h2>4. Client Responsibilities</h2>
            <p>
              Clients are responsible for providing necessary content, feedback, and approvals in a timely manner. Delays in client response may impact project timelines.
            </p>
            
            <h2>5. Intellectual Property</h2>
            <p>
              Upon full payment, clients receive ownership rights to the final deliverables. Socilet retains the right to display the work in its portfolio unless otherwise specified.
            </p>
            
            <h2>6. Termination</h2>
            <p>
              Either party may terminate the service agreement with written notice if the other party breaches any material term of these Terms of Service.
            </p>
            
            <h2>7. Limitation of Liability</h2>
            <p>
              Socilet shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our services.
            </p>
            
            <h2>8. Amendments</h2>
            <p>
              Socilet reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website.
            </p>
            
            <h2>9. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by the laws of India without regard to its conflict of law provisions.
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
