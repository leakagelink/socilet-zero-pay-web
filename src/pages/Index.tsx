
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
      />
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
