
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
    console.log('Checking authentication status...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'Logged in' : 'Not logged in');
      setIsAuthenticated(!!user);
      setLoading(!!user); // Only set loading to true if user is authenticated
    });
    return () => unsubscribe();
  }, []);

  // Load affiliate data when authenticated
  useEffect(() => {
    const loadAffiliateData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      console.log('Loading affiliate data...');
      try {
        setLoading(true);
        const affiliateData = await getCurrentAffiliate();
        console.log('Affiliate data loaded:', affiliateData);
        setAffiliate(affiliateData);
        
        if (affiliateData) {
          console.log('Loading referrals and stats...');
          const [referralData, statsData] = await Promise.all([
            getAffiliateReferrals(),
            getAffiliateStats()
          ]);
          console.log('Referrals loaded:', referralData.length);
          console.log('Stats loaded:', statsData);
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
      navigate('/login?redirectTo=/affiliate');
      return null;
    }

    try {
      setLoading(true);
      console.log('Registering affiliate:', name, email);
      const newAffiliate = await registerAffiliate(name, email);
      console.log('Affiliate registered:', newAffiliate);
      setAffiliate(newAffiliate);
      
      // Reload stats and referrals after registration
      console.log('Loading referrals and stats after registration...');
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
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access affiliate data',
        variant: 'destructive'
      });
      navigate('/login?redirectTo=/affiliate');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Refreshing affiliate data...');
      const [affiliateData, referralData, statsData] = await Promise.all([
        getCurrentAffiliate(),
        getAffiliateReferrals(),
        getAffiliateStats()
      ]);
      
      console.log('Refreshed affiliate data:', affiliateData);
      console.log('Refreshed referrals:', referralData.length);
      console.log('Refreshed stats:', statsData);
      
      setAffiliate(affiliateData);
      setReferrals(referralData);
      setStats(statsData);
      
      toast({
        title: 'Data Refreshed',
        description: 'Affiliate data has been updated',
      });
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
