
import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SupportBar from '../components/SupportBar';
import VersionChecker from '../components/VersionChecker';
import { Toaster } from 'sonner';
import { Helmet } from 'react-helmet';
import CacheRefresher from '../components/home/CacheRefresher';
import MainContent from '../components/home/MainContent';
import VerificationDialog from '../components/home/VerificationDialog';

const Index = () => {
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  
  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      <Helmet>
        <title>Socilet - Brand Your Dream | Web & App Development Services</title>
        <meta name="description" content="Socilet offers zero advance payment web & app development services. Get professional websites, mobile apps, and digital branding solutions." />
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
