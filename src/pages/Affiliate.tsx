
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AffiliateRegistration from '../components/affiliate/AffiliateRegistration';
import AffiliateDashboard from '../components/affiliate/AffiliateDashboard';
import { useAffiliateProgram } from '../hooks/useAffiliateProgram';

const Affiliate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const {
    affiliateProfile,
    affiliateStats,
    referrals,
    registerAsAffiliate,
    refreshData,
    generateAffiliateLink,
    isLoading: dataLoading,
    isRegistering
  } = useAffiliateProgram();

  // Authentication check
  useEffect(() => {
    console.log('Affiliate: Checking authentication status');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('Affiliate: User not authenticated, redirecting to login');
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the affiliate program",
        });
        navigate('/login?redirectTo=/affiliate');
      } else {
        console.log('Affiliate: User authenticated:', user.email);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {affiliateProfile ? (
                <AffiliateDashboard
                  profile={affiliateProfile}
                  referrals={referrals}
                  stats={affiliateStats}
                  onRefresh={refreshData}
                  isLoading={dataLoading}
                  generateAffiliateLink={generateAffiliateLink}
                />
              ) : (
                <AffiliateRegistration 
                  onRegister={registerAsAffiliate}
                  isLoading={isRegistering || dataLoading}
                />
              )}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Affiliate;
