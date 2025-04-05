
import { getAffiliateProfile } from './profileService';
import { getAffiliateReferrals } from './referralService';
import { AffiliateStatistics } from './types';

/**
 * Get statistics for the current affiliate
 */
export const getAffiliateStatistics = async (): Promise<AffiliateStatistics> => {
  try {
    const profile = await getAffiliateProfile();
    const referrals = await getAffiliateReferrals();
    
    if (!profile) {
      return {
        totalReferrals: 0,
        pendingReferrals: 0,
        activeProjects: 0,
        completedProjects: 0,
        rejectedProjects: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0
      };
    }
    
    // Calculate stats
    const stats: AffiliateStatistics = {
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter(r => r.status === 'pending').length,
      activeProjects: referrals.filter(r => r.status === 'active').length,
      completedProjects: referrals.filter(r => r.status === 'completed').length,
      rejectedProjects: referrals.filter(r => r.status === 'rejected').length,
      totalEarnings: profile.totalEarnings || 0,
      pendingEarnings: profile.pendingEarnings || 0,
      paidEarnings: profile.paidEarnings || 0
    };
    
    return stats;
  } catch (error) {
    console.error('Error calculating affiliate statistics:', error);
    return {
      totalReferrals: 0,
      pendingReferrals: 0,
      activeProjects: 0,
      completedProjects: 0,
      rejectedProjects: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0
    };
  }
};
