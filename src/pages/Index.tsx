
import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import VersionChecker from '../components/VersionChecker';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet';
import CacheRefresher from '../components/home/CacheRefresher';
import MainContent from '../components/home/MainContent';
import VerificationDialog from '../components/home/VerificationDialog';

const Index = () => {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Socilet - Brand Your Dream | Web & App Development Services</title>
        <meta name="description" content="Socilet offers zero advance payment web & app development services. Get professional websites, mobile apps, and digital branding solutions." />
      </Helmet>
      <Toaster position="top-right" richColors />
      <VersionChecker />
      <CacheRefresher />
      <Header />
      <main>
        <Hero />
        <MainContent />
        <VerificationDialog 
          isOpen={isVerificationDialogOpen} 
          onOpenChange={setIsVerificationDialogOpen} 
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
