
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ReferralProject, ReferralStatus, AffiliateUser } from './types';
import { getCurrentAffiliate, getAffiliateByCode } from './profileService';

/**
 * Get all referrals for the current affiliate
 */
export const getAffiliateReferrals = async (): Promise<ReferralProject[] | null> => {
  try {
    console.log('affiliateService: Getting referrals for current affiliate');
    
    // First get the affiliate record
    const affiliate = await getCurrentAffiliate();
    if (!affiliate || !affiliate.id) {
      console.log('affiliateService: No affiliate found, returning empty array');
      return [];
    }

    // Query for referrals
    console.log('affiliateService: Querying referrals for affiliate ID:', affiliate.id);
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('affiliateId', '==', affiliate.id));
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
      console.log('affiliateService: Found', querySnapshot.size, 'referrals');
    } catch (error) {
      console.error('affiliateService: Error querying referrals:', error);
      throw new Error('Failed to query referral records');
    }
    
    const referrals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReferralProject[];
    
    console.log('affiliateService: Returning', referrals.length, 'referrals');
    return referrals;
  } catch (error) {
    console.error('affiliateService: Error in getAffiliateReferrals:', error);
    return [];
  }
};

/**
 * Track a new referral
 */
export const trackReferral = async (
  affiliateCode: string, 
  referredEmail: string, 
  referredName: string,
  isResale: boolean = false
): Promise<ReferralProject | null> => {
  try {
    const affiliate = await getAffiliateByCode(affiliateCode);
    if (!affiliate || !affiliate.id) {
      return null;
    }

    const referralData: ReferralProject = {
      affiliateId: affiliate.id,
      referredEmail,
      referredName,
      status: 'pending',
      commissionRate: isResale ? 0 : 0.25, // 25% for regular referrals, 0% for resale
      isResale,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const referralsRef = collection(db, 'referrals');
    const docRef = await addDoc(referralsRef, referralData);
    
    return {
      id: docRef.id,
      ...referralData
    };
  } catch (error) {
    console.error('Error in trackReferral:', error);
    return null;
  }
};

/**
 * Update referral status
 */
export const updateReferralStatus = async (
  referralId: string, 
  status: ReferralStatus, 
  projectData?: { projectName?: string, serviceAmount?: number }
): Promise<boolean> => {
  try {
    const referralRef = doc(db, 'referrals', referralId);
    const referralSnap = await getDoc(referralRef);
    
    if (!referralSnap.exists()) {
      return false;
    }
    
    const referral = referralSnap.data() as ReferralProject;
    
    // Calculate commission if project is completed and has a service amount
    let commissionAmount = undefined;
    if (status === 'completed' && projectData?.serviceAmount && !referral.isResale) {
      commissionAmount = projectData.serviceAmount * referral.commissionRate;
      
      // Update affiliate earnings if there's a commission
      if (referral.affiliateId && commissionAmount > 0) {
        const affiliateRef = doc(db, 'affiliates', referral.affiliateId);
        const affiliateSnap = await getDoc(affiliateRef);
        
        if (affiliateSnap.exists()) {
          const affiliate = affiliateSnap.data() as AffiliateUser;
          await updateDoc(affiliateRef, {
            totalEarnings: (affiliate.totalEarnings || 0) + commissionAmount,
            pendingEarnings: (affiliate.pendingEarnings || 0) + commissionAmount
          });
        }
      }
    }
    
    // Update the referral with new status and project info
    await updateDoc(referralRef, {
      status,
      ...(projectData?.projectName && { projectName: projectData.projectName }),
      ...(projectData?.serviceAmount && { serviceAmount: projectData.serviceAmount }),
      ...(commissionAmount !== undefined && { commissionAmount }),
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error in updateReferralStatus:", error);
    return false;
  }
};
