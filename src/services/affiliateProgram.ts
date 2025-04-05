
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
import { db, auth } from '../lib/firebase';

// Types
export type AffiliateProfile = {
  id?: string;
  userId: string;
  name: string;
  email: string;
  affiliateCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  createdAt?: any;
};

export type ReferralStatus = 'pending' | 'active' | 'completed' | 'rejected';

export type AffiliateReferral = {
  id?: string;
  affiliateId: string;
  clientName: string;
  clientEmail: string;
  projectName?: string;
  status: ReferralStatus;
  commissionRate: number;
  serviceAmount?: number;
  commissionAmount?: number;
  isReseller: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type AffiliateStatistics = {
  totalReferrals: number;
  pendingReferrals: number;
  activeProjects: number;
  completedProjects: number;
  rejectedProjects: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
};

// Generate a unique affiliate code
const generateUniqueCode = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${base}${random}`;
};

// Get affiliate profile for current user
export const getAffiliateProfile = async (): Promise<AffiliateProfile | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('affiliateProgram: No authenticated user');
      return null;
    }

    console.log('affiliateProgram: Querying affiliate profile for', user.uid);
    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('userId', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('affiliateProgram: No profile found');
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as AffiliateProfile;
    
    console.log('affiliateProgram: Profile found with code', data.affiliateCode);
    return {
      id: doc.id,
      ...data
    };
  } catch (error) {
    console.error('Error fetching affiliate profile:', error);
    return null;
  }
};

// Register a new affiliate
export const registerAffiliate = async (name: string, email: string): Promise<AffiliateProfile | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('affiliateProgram: Registration failed - user not authenticated');
      return null;
    }

    // Check if already registered
    const existingProfile = await getAffiliateProfile();
    if (existingProfile) {
      console.log('affiliateProgram: User already registered as affiliate');
      return existingProfile;
    }

    // Create new profile
    const affiliateCode = generateUniqueCode(name);
    const profileData: AffiliateProfile = {
      userId: user.uid,
      name,
      email: email || user.email || '',
      affiliateCode,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
      createdAt: serverTimestamp()
    };

    console.log('affiliateProgram: Creating new affiliate profile');
    const affiliatesRef = collection(db, 'affiliates');
    const docRef = await addDoc(affiliatesRef, profileData);
    
    return {
      id: docRef.id,
      ...profileData
    };
  } catch (error) {
    console.error('Error registering affiliate:', error);
    return null;
  }
};

// Get affiliate by code (for tracking referrals)
export const getAffiliateByCode = async (code: string): Promise<AffiliateProfile | null> => {
  try {
    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('affiliateCode', '==', code));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as AffiliateProfile
    };
  } catch (error) {
    console.error('Error fetching affiliate by code:', error);
    return null;
  }
};

// Get all referrals for the current affiliate
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

// Track a new referral
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

// Update a referral's status and details
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
          const affiliate = affiliateSnap.data() as AffiliateProfile;
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

// Get statistics for the current affiliate
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

// Process a payment to affiliate
export const processAffiliatePayment = async (
  affiliateId: string,
  amount: number
): Promise<boolean> => {
  try {
    const affiliateRef = doc(db, 'affiliates', affiliateId);
    const affiliateSnap = await getDoc(affiliateRef);
    
    if (!affiliateSnap.exists()) {
      return false;
    }
    
    const affiliate = affiliateSnap.data() as AffiliateProfile;
    
    if (affiliate.pendingEarnings < amount) {
      return false;
    }
    
    await updateDoc(affiliateRef, {
      pendingEarnings: affiliate.pendingEarnings - amount,
      paidEarnings: (affiliate.paidEarnings || 0) + amount
    });
    
    return true;
  } catch (error) {
    console.error('Error processing payment:', error);
    return false;
  }
};
