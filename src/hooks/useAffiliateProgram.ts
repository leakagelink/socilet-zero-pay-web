
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { auth } from '../lib/firebase';
import { 
  getAffiliateProfile, 
  registerAffiliate, 
  getAffiliateReferrals,
  getAffiliateStatistics,
  AffiliateProfile,
  AffiliateReferral,
  AffiliateStatistics
} from '../services/affiliate';

export const useAffiliateProgram = () => {
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateProfile | null>(null);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStatistics>({
    totalReferrals: 0,
    pendingReferrals: 0,
    activeProjects: 0,
    completedProjects: 0,
    rejectedProjects: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();

  // Load affiliate data on mount
  useEffect(() => {
    loadAffiliateData();
  }, []);

  // Load all affiliate data
  const loadAffiliateData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('useAffiliateProgram: Loading affiliate data');
      
      // Get affiliate profile
      const profile = await getAffiliateProfile();
      setAffiliateProfile(profile);
      
      if (profile) {
        // If profile exists, get referrals and stats
        const [fetchedReferrals, stats] = await Promise.all([
          getAffiliateReferrals(),
          getAffiliateStatistics()
        ]);
        
        setReferrals(fetchedReferrals || []);
        setAffiliateStats(stats || {
          totalReferrals: 0,
          pendingReferrals: 0,
          activeProjects: 0,
          completedProjects: 0,
          rejectedProjects: 0,
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0
        });
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load affiliate data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Register as an affiliate
  const registerAsAffiliate = async (name: string, email: string) => {
    if (isRegistering) {
      console.log('Registration already in progress, ignoring duplicate request');
      return false;
    }
    
    try {
      setIsRegistering(true);
      console.log('useAffiliateProgram: Registering new affiliate', { name, email });
      
      const newProfile = await registerAffiliate(name, email);
      if (newProfile) {
        setAffiliateProfile(newProfile);
        toast({
          title: 'Success!',
          description: 'You have successfully registered as an affiliate',
        });
        
        // Reload data to get initial stats
        await loadAffiliateData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering affiliate:', error);
      toast({
        title: 'Registration Failed',
        description: 'Could not complete your registration. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  // Refresh affiliate data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      await loadAffiliateData();
      toast({
        title: 'Updated',
        description: 'Your affiliate data has been refreshed',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Refresh Failed',
        description: 'Could not refresh your data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate affiliate link with the correct code
  const generateAffiliateLink = (code: string) => {
    return `${window.location.origin}/?ref=${code}`;
  };

  return {
    affiliateProfile,
    affiliateStats,
    referrals,
    isLoading,
    isRegistering,
    registerAsAffiliate,
    refreshData,
    generateAffiliateLink
  };
};
