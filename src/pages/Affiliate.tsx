
import React, { useState } from 'react';
import { motion } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';
import AffiliateRegistration from '../components/affiliate/AffiliateRegistration';
import AffiliateDashboard from '../components/affiliate/AffiliateDashboard';
import { useAffiliate } from '../hooks/useAffiliate';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Affiliate = () => {
  const navigate = useNavigate();
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

  // If user is not signed in, show this content
  const renderSignInPrompt = () => (
    <motion.div 
      className="max-w-3xl mx-auto text-center bg-white rounded-xl shadow-lg p-8 md:p-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Affiliate Program</h1>
      <div className="w-20 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mb-6 rounded-full"></div>
      
      <p className="text-gray-600 mb-8 text-lg">
        Sign in to join our affiliate program and start earning 25% commission on referred projects!
      </p>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button 
          onClick={() => navigate('/login')}
          className="bg-primary-600 hover:bg-primary-700"
          size="lg"
        >
          Sign In to Continue
        </Button>
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          size="lg"
        >
          Return to Homepage
        </Button>
      </div>
    </motion.div>
  );

  // Loading state
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            renderLoading()
          ) : !isAuthenticated ? (
            renderSignInPrompt()
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
                stats={stats!}
                getAffiliateLink={getAffiliateLink}
                onRefresh={refreshData}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
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
