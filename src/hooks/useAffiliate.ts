
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
    console.log('useAffiliate: Checking authentication status...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isAuthed = !!user;
      console.log('useAffiliate: Auth state changed:', isAuthed ? 'Logged in' : 'Not logged in');
      setIsAuthenticated(isAuthed);
      if (!isAuthed) {
        // Clear data if not authenticated
        setAffiliate(null);
        setReferrals([]);
        setStats(null);
      }
      setLoading(isAuthed); // Only set loading to true if user is authenticated
    });
    return () => unsubscribe();
  }, []);

  // Load affiliate data when authenticated
  useEffect(() => {
    const loadAffiliateData = async () => {
      if (!isAuthenticated) {
        console.log('useAffiliate: Not authenticated, skipping data load');
        setLoading(false);
        return;
      }
      
      console.log('useAffiliate: Loading affiliate data...');
      try {
        setLoading(true);
        const affiliateData = await getCurrentAffiliate();
        console.log('useAffiliate: Affiliate data loaded:', affiliateData);
        setAffiliate(affiliateData);
        
        if (affiliateData) {
          console.log('useAffiliate: Loading referrals and stats...');
          const [referralData, statsData] = await Promise.all([
            getAffiliateReferrals(),
            getAffiliateStats()
          ]);
          console.log('useAffiliate: Referrals loaded:', referralData?.length);
          console.log('useAffiliate: Stats loaded:', statsData);
          setReferrals(referralData || []);
          setStats(statsData);
        } else {
          console.log('useAffiliate: No affiliate data found, clearing referrals and stats');
          setReferrals([]);
          setStats(null);
        }
      } catch (error) {
        console.error('useAffiliate: Error loading affiliate data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load affiliate data. Please try again.',
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
      console.log('useAffiliate: Not authenticated for registration, redirecting to login');
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
      console.log('useAffiliate: Registering affiliate:', name, email);
      const newAffiliate = await registerAffiliate(name, email);
      console.log('useAffiliate: Affiliate registered:', newAffiliate);
      setAffiliate(newAffiliate);
      
      // Reload stats and referrals after registration
      if (newAffiliate) {
        console.log('useAffiliate: Loading referrals and stats after registration...');
        const [referralData, statsData] = await Promise.all([
          getAffiliateReferrals(),
          getAffiliateStats()
        ]);
        setReferrals(referralData || []);
        setStats(statsData);
        
        toast({
          title: 'Success',
          description: 'You have successfully joined our affiliate program!',
        });
      }
      
      return newAffiliate;
    } catch (error) {
      console.error('useAffiliate: Error registering affiliate:', error);
      toast({
        title: 'Registration Failed',
        description: 'Could not complete affiliate registration. Please try again.',
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
      console.log('useAffiliate: Not authenticated for refresh, redirecting to login');
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
      console.log('useAffiliate: Refreshing affiliate data...');
      const [affiliateData, referralData, statsData] = await Promise.all([
        getCurrentAffiliate(),
        getAffiliateReferrals(),
        getAffiliateStats()
      ]);
      
      console.log('useAffiliate: Refreshed affiliate data:', affiliateData);
      console.log('useAffiliate: Refreshed referrals:', referralData?.length);
      console.log('useAffiliate: Refreshed stats:', statsData);
      
      setAffiliate(affiliateData);
      setReferrals(referralData || []);
      setStats(statsData);
      
      toast({
        title: 'Data Refreshed',
        description: 'Affiliate data has been updated',
      });
    } catch (error) {
      console.error('useAffiliate: Error refreshing affiliate data:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh affiliate data. Please try again.',
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
