
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  DocumentData 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export type AffiliateUser = {
  id?: string;
  userId: string;
  email: string;
  name: string;
  affiliateCode: string;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  createdAt?: any;
};

export type ReferralStatus = 'pending' | 'started' | 'rejected' | 'completed';

export type ReferralProject = {
  id?: string;
  affiliateId: string;
  referredEmail: string;
  referredName: string;
  projectName?: string;
  status: ReferralStatus;
  commissionRate: number;
  serviceAmount?: number;
  commissionAmount?: number;
  isResale: boolean;
  createdAt?: any;
  updatedAt?: any;
};

export type AffiliateStats = {
  totalReferrals: number;
  pendingReferrals: number;
  startedProjects: number;
  completedProjects: number;
  rejectedProjects: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
};

// Generate a unique affiliate code
const generateAffiliateCode = (name: string) => {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${base}${random}`;
};

// Register a new affiliate
export const registerAffiliate = async (name: string, email: string): Promise<AffiliateUser | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('Registration failed: User not authenticated');
      return null;
    }

    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    // If user is already an affiliate, return the existing data
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data() as AffiliateUser;
      return {
        id: querySnapshot.docs[0].id,
        ...data
      };
    }

    // Create new affiliate
    const affiliateData: AffiliateUser = {
      userId: user.uid,
      email: email || user.email || '',
      name,
      affiliateCode: generateAffiliateCode(name),
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(affiliatesRef, affiliateData);
    
    return {
      id: docRef.id,
      ...affiliateData
    };
  } catch (error) {
    console.error('Error in registerAffiliate:', error);
    return null;
  }
};

// Get affiliate data for current user
export const getCurrentAffiliate = async (): Promise<AffiliateUser | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('getCurrentAffiliate: No authenticated user');
      return null;
    }

    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('getCurrentAffiliate: No affiliate record found for user');
      return null;
    }

    const data = querySnapshot.docs[0].data() as AffiliateUser;
    return {
      id: querySnapshot.docs[0].id,
      ...data
    };
  } catch (error) {
    console.error('Error in getCurrentAffiliate:', error);
    return null;
  }
};

// Get affiliate by code
export const getAffiliateByCode = async (code: string): Promise<AffiliateUser | null> => {
  try {
    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('affiliateCode', '==', code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const data = querySnapshot.docs[0].data() as AffiliateUser;
    return {
      id: querySnapshot.docs[0].id,
      ...data
    };
  } catch (error) {
    console.error('Error in getAffiliateByCode:', error);
    return null;
  }
};

// Track a new referral
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

// Update referral status
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

// Get referrals for current affiliate
export const getAffiliateReferrals = async (): Promise<ReferralProject[] | null> => {
  try {
    const affiliate = await getCurrentAffiliate();
    if (!affiliate || !affiliate.id) {
      console.log('getAffiliateReferrals: No affiliate found, returning empty array');
      return [];
    }

    const referralsRef = collection(db, 'referrals');
    const q = query(referralsRef, where('affiliateId', '==', affiliate.id));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ReferralProject[];
  } catch (error) {
    console.error('Error in getAffiliateReferrals:', error);
    return null;
  }
};

// Get statistics for current affiliate
export const getAffiliateStats = async (): Promise<AffiliateStats | null> => {
  try {
    const referralsResult = await getAffiliateReferrals();
    const referrals = referralsResult || [];
    const affiliate = await getCurrentAffiliate();
    
    if (!affiliate) {
      console.log('getAffiliateStats: No affiliate found, returning default stats');
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
    
    return stats;
  } catch (error) {
    console.error('Error in getAffiliateStats:', error);
    return null;
  }
};
