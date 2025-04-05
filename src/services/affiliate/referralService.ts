
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
import { AffiliateReferral, ReferralStatus } from './types';
import { getAffiliateProfile, getAffiliateByCode } from './profileService';

/**
 * Get all referrals for the current affiliate
 */
export const getAffiliateReferrals = async (): Promise<AffiliateReferral[]> => {
  try {
    const profile = await getAffiliateProfile();
    if (!profile || !profile.id) {
      return [];
    }

    console.log('affiliateProgram: Fetching referrals for affiliate ID', profile.id);
    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('affiliateId', '==', profile.id));
    const snapshot = await getDocs(q);

    const referrals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as AffiliateReferral
    }));
    
    console.log('affiliateProgram: Found', referrals.length, 'referrals');
    return referrals;
  } catch (error) {
    console.error('Error fetching affiliate referrals:', error);
    return [];
  }
};

/**
 * Track a new referral
 */
export const createReferral = async (
  affiliateCode: string,
  clientName: string,
  clientEmail: string,
  isReseller: boolean = false
): Promise<AffiliateReferral | null> => {
  try {
    const affiliate = await getAffiliateByCode(affiliateCode);
    if (!affiliate || !affiliate.id) {
      console.error('affiliateProgram: Invalid affiliate code', affiliateCode);
      return null;
    }

    const referralData: AffiliateReferral = {
      affiliateId: affiliate.id,
      clientName,
      clientEmail,
      status: 'pending',
      commissionRate: isReseller ? 0 : 0.25, // 25% for regular, 0% for reseller
      isReseller,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const referralsRef = collection(db, 'referrals');
    const docRef = await addDoc(referralsRef, referralData);
    
    console.log('affiliateProgram: Created new referral', docRef.id);
    return {
      id: docRef.id,
      ...referralData
    };
  } catch (error) {
    console.error('Error creating referral:', error);
    return null;
  }
};

/**
 * Update a referral's status and details
 */
export const updateReferralStatus = async (
  referralId: string,
  status: ReferralStatus,
  details?: {
    projectName?: string;
    serviceAmount?: number;
  }
): Promise<boolean> => {
  try {
    const referralRef = doc(db, 'referrals', referralId);
    const referralSnap = await getDoc(referralRef);
    
    if (!referralSnap.exists()) {
      console.error('affiliateProgram: Referral not found', referralId);
      return false;
    }
    
    const referral = referralSnap.data() as AffiliateReferral;
    let commissionAmount = undefined;
    
    // Calculate commission if project completed
    if (status === 'completed' && details?.serviceAmount && !referral.isReseller) {
      commissionAmount = details.serviceAmount * referral.commissionRate;
      
      // Update affiliate earnings
      if (commissionAmount > 0 && referral.affiliateId) {
        const affiliateRef = doc(db, 'affiliates', referral.affiliateId);
        const affiliateSnap = await getDoc(affiliateRef);
        
        if (affiliateSnap.exists()) {
          const affiliate = affiliateSnap.data();
          await updateDoc(affiliateRef, {
            totalEarnings: (affiliate.totalEarnings || 0) + commissionAmount,
            pendingEarnings: (affiliate.pendingEarnings || 0) + commissionAmount
          });
          console.log('affiliateProgram: Updated affiliate earnings', commissionAmount);
        }
      }
    }
    
    // Update referral
    await updateDoc(referralRef, {
      status,
      ...(details?.projectName && { projectName: details.projectName }),
      ...(details?.serviceAmount && { serviceAmount: details.serviceAmount }),
      ...(commissionAmount !== undefined && { commissionAmount }),
      updatedAt: serverTimestamp()
    });
    
    console.log('affiliateProgram: Updated referral status to', status);
    return true;
  } catch (error) {
    console.error('Error updating referral:', error);
    return false;
  }
};
