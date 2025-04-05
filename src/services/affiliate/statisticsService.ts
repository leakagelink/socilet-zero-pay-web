
import { getCurrentAffiliate } from './profileService';
import { getAffiliateReferrals } from './referralService';
import { AffiliateStats } from './types';

/**
 * Get statistics for current affiliate
 */
export const getAffiliateStats = async (): Promise<AffiliateStats | null> => {
  try {
    console.log('affiliateService: Calculating affiliate stats');
    
    // Get referrals and affiliate data
    const referralsResult = await getAffiliateReferrals();
    const referrals = referralsResult || [];
    const affiliate = await getCurrentAffiliate();
    
    if (!affiliate) {
      console.log('affiliateService: No affiliate found, returning default stats');
      return {
        totalReferrals: 0,
        pendingReferrals: 0,
        startedProjects: 0,
        completedProjects: 0,
        rejectedProjects: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0
      };
    }
    
    // Calculate stats
    console.log('affiliateService: Calculating stats from', referrals.length, 'referrals');
    const stats: AffiliateStats = {
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter(r => r.status === 'pending').length,
      startedProjects: referrals.filter(r => r.status === 'started').length,
      completedProjects: referrals.filter(r => r.status === 'completed').length,
      rejectedProjects: referrals.filter(r => r.status === 'rejected').length,
      totalEarnings: affiliate?.totalEarnings || 0,
      pendingEarnings: affiliate?.pendingEarnings || 0,
      paidEarnings: affiliate?.paidEarnings || 0
    };
    
    console.log('affiliateService: Stats calculated:', stats);
    return stats;
  } catch (error) {
    console.error('affiliateService: Error in getAffiliateStats:', error);
    // Return default stats on error
    return {
      totalReferrals: 0,
      pendingReferrals: 0,
      startedProjects: 0,
      completedProjects: 0,
      rejectedProjects: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0
    };
  }
};
