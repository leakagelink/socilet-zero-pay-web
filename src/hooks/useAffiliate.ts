
import { useState, useEffect, useCallback } from 'react';
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
  const [dataLoaded, setDataLoaded] = useState(false);
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
        setDataLoaded(false);
        setLoading(false);
      } else {
        setLoading(true); // Set loading to true when user is authenticated, will load data
      }
    });
    return () => unsubscribe();
  }, []);

  // Load affiliate data when authenticated - now with improved error handling
  const loadAffiliateData = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('useAffiliate: Not authenticated, skipping data load');
      setLoading(false);
      return;
    }
    
    console.log('useAffiliate: Loading affiliate data...');
    try {
      setLoading(true);
      
      // First check if user is an affiliate
      const affiliateData = await getCurrentAffiliate();
      console.log('useAffiliate: Affiliate data loaded:', affiliateData ? 'exists' : 'null');
      setAffiliate(affiliateData);
      
      if (affiliateData) {
        console.log('useAffiliate: Loading referrals and stats...');
        try {
          // Load referrals and stats in parallel
          const [referralData, statsData] = await Promise.all([
            getAffiliateReferrals(),
            getAffiliateStats()
          ]);
          
          console.log('useAffiliate: Referrals loaded:', referralData?.length || 0);
          console.log('useAffiliate: Stats loaded:', statsData ? 'exists' : 'null');
          
          // Set data even if empty arrays (better than null)
          setReferrals(referralData || []);
          setStats(statsData || {
            totalReferrals: 0,
            pendingReferrals: 0,
            startedProjects: 0,
            completedProjects: 0,
            rejectedProjects: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            paidEarnings: 0
          });
        } catch (error) {
          console.error('useAffiliate: Error loading referrals or stats:', error);
          // Set empty arrays/defaults even if error
          setReferrals([]);
          setStats({
            totalReferrals: 0,
            pendingReferrals: 0,
            startedProjects: 0,
            completedProjects: 0,
            rejectedProjects: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            paidEarnings: 0
          });
          toast({
            title: 'Data Loading Issue',
            description: 'Some affiliate data could not be loaded. Please try refreshing.',
            variant: 'destructive'
          });
        }
      } else {
        console.log('useAffiliate: No affiliate data found, clearing referrals and stats');
        setReferrals([]);
        setStats(null);
      }
      
      setDataLoaded(true);
    } catch (error) {
      console.error('useAffiliate: Error loading affiliate data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load affiliate data. Please try again.',
        variant: 'destructive'
      });
      // Set empty data on error
      setAffiliate(null);
      setReferrals([]);
      setStats(null);
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  // Load data when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      loadAffiliateData();
    }
  }, [isAuthenticated, dataLoaded, loadAffiliateData]);

  // Register new affiliate - now with better error handling
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
      if (!newAffiliate) {
        throw new Error('Registration returned null');
      }
      
      console.log('useAffiliate: Affiliate registered successfully:', newAffiliate.affiliateCode);
      setAffiliate(newAffiliate);
      
      // Reload stats and referrals after registration
      try {
        console.log('useAffiliate: Loading referrals and stats after registration...');
        const [referralData, statsData] = await Promise.all([
          getAffiliateReferrals(),
          getAffiliateStats()
        ]);
        setReferrals(referralData || []);
        setStats(statsData);
        setDataLoaded(true);
        
        toast({
          title: 'Success',
          description: 'You have successfully joined our affiliate program!',
        });
      } catch (error) {
        console.error('useAffiliate: Error loading data after registration:', error);
        // Set defaults
        setReferrals([]);
        setStats({
          totalReferrals: 0,
          pendingReferrals: 0,
          startedProjects: 0,
          completedProjects: 0,
          rejectedProjects: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0
        });
        
        toast({
          title: 'Partial Success',
          description: 'Registration successful but some data failed to load. Please refresh.',
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

  // Refresh affiliate data - with improved error handling
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
      
      // First check if user is still an affiliate
      const affiliateData = await getCurrentAffiliate();
      console.log('useAffiliate: Refreshed affiliate data:', affiliateData ? 'exists' : 'null');
      
      if (!affiliateData) {
        // If no longer an affiliate (unlikely but possible)
        setAffiliate(null);
        setReferrals([]);
        setStats(null);
        setDataLoaded(true);
        
        toast({
          title: 'No Affiliate Account',
          description: 'You do not appear to have an affiliate account.',
          variant: 'destructive'
        });
        
        setLoading(false);
        return;
      }
      
      setAffiliate(affiliateData);
      
      // Now load referrals and stats
      try {
        const [referralData, statsData] = await Promise.all([
          getAffiliateReferrals(),
          getAffiliateStats()
        ]);
        
        console.log('useAffiliate: Refreshed referrals:', referralData?.length || 0);
        console.log('useAffiliate: Refreshed stats:', statsData ? 'exists' : 'null');
        
        setReferrals(referralData || []);
        setStats(statsData);
        
        toast({
          title: 'Data Refreshed',
          description: 'Affiliate data has been updated',
        });
      } catch (error) {
        console.error('useAffiliate: Error refreshing referrals or stats:', error);
        toast({
          title: 'Partial Refresh',
          description: 'Some affiliate data could not be refreshed. Please try again.',
          variant: 'destructive'
        });
      }
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
