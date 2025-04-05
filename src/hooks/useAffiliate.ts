
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  AffiliateUser,
  ReferralProject,
  AffiliateStats,
  registerAffiliate,
  getCurrentAffiliate,
  getAffiliateReferrals,
  getAffiliateStats
} from '../services/affiliateService';
import { useToast } from './use-toast';

export const useAffiliate = () => {
  const [affiliate, setAffiliate] = useState<AffiliateUser | null>(null);
  const [referrals, setReferrals] = useState<ReferralProject[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load affiliate data when authenticated
  useEffect(() => {
    const loadAffiliateData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const affiliateData = await getCurrentAffiliate();
        setAffiliate(affiliateData);
        
        if (affiliateData) {
          const [referralData, statsData] = await Promise.all([
            getAffiliateReferrals(),
            getAffiliateStats()
          ]);
          setReferrals(referralData);
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error loading affiliate data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load affiliate data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadAffiliateData();
  }, [isAuthenticated, toast]);

  // Register new affiliate
  const register = async (name: string, email: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to join the affiliate program',
        variant: 'destructive'
      });
      navigate('/login');
      return null;
    }

    try {
      setLoading(true);
      const newAffiliate = await registerAffiliate(name, email);
      setAffiliate(newAffiliate);
      
      // Reload stats and referrals after registration
      const [referralData, statsData] = await Promise.all([
        getAffiliateReferrals(),
        getAffiliateStats()
      ]);
      setReferrals(referralData);
      setStats(statsData);
      
      toast({
        title: 'Success',
        description: 'You have successfully joined our affiliate program!',
      });
      
      return newAffiliate;
    } catch (error) {
      console.error('Error registering affiliate:', error);
      toast({
        title: 'Registration Failed',
        description: 'Could not complete affiliate registration',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Refresh affiliate data
  const refreshData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const [affiliateData, referralData, statsData] = await Promise.all([
        getCurrentAffiliate(),
        getAffiliateReferrals(),
        getAffiliateStats()
      ]);
      
      setAffiliate(affiliateData);
      setReferrals(referralData);
      setStats(statsData);
    } catch (error) {
      console.error('Error refreshing affiliate data:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh affiliate data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate affiliate link
  const getAffiliateLink = (affiliateCode: string) => {
    return `${window.location.origin}/?ref=${affiliateCode}`;
  };

  return {
    affiliate,
    referrals,
    stats,
    loading,
    isAuthenticated,
    register,
    refreshData,
    getAffiliateLink
  };
};
