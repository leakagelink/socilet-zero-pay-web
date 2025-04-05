
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';
import AffiliateRegistration from '../components/affiliate/AffiliateRegistration';
import AffiliateDashboard from '../components/affiliate/AffiliateDashboard';
import { useAffiliate } from '../hooks/useAffiliate';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useToast } from '@/hooks/use-toast';

const Affiliate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const {
    affiliate,
    referrals,
    stats,
    loading,
    isAuthenticated,
    register,
    refreshData,
    getAffiliateLink
  } = useAffiliate();
  
  // Check authentication status when component mounts
  useEffect(() => {
    console.log('Affiliate page: Checking authentication');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log('Affiliate page: User not authenticated, redirecting to login');
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the affiliate program",
        });
        navigate('/login?redirectTo=/affiliate');
      } else {
        console.log('Affiliate page: User authenticated:', user.email);
      }
      setAuthChecked(true);
      setInitialLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate, toast]);

  // If initial check not completed, show loading
  if (initialLoading) {
    console.log('Affiliate page: Initial loading');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <div className="max-w-3xl mx-auto w-full">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If auth checked and not authenticated, this component will unmount due to redirect
  // But include fallback just in case
  if (authChecked && !isAuthenticated) {
    console.log('Affiliate page: Auth checked but not authenticated');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="mb-4">Please sign in to access the affiliate program</p>
            <Button onClick={() => navigate('/login?redirectTo=/affiliate')}>
              Go to Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Loading state for affiliate data
  const renderLoading = () => (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <Skeleton className="h-8 w-64 mb-6" />
      <div className="grid gap-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );

  console.log('Affiliate page: Rendering main content', { 
    affiliate: affiliate ? 'exists' : 'null', 
    loading
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            renderLoading()
          ) : affiliate ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8"
            >
              <AffiliateDashboard
                affiliate={affiliate}
                referrals={referrals}
                stats={stats || {
                  totalReferrals: 0,
                  pendingReferrals: 0,
                  startedProjects: 0,
                  completedProjects: 0,
                  rejectedProjects: 0,
                  totalEarnings: 0,
                  pendingEarnings: 0,
                  paidEarnings: 0
                }}
                getAffiliateLink={getAffiliateLink}
                onRefresh={refreshData}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <AffiliateRegistration 
                onRegister={register}
                isLoading={loading}
              />
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Affiliate;
