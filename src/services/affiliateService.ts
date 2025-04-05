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

// Register a new affiliate - with improved error handling
export const registerAffiliate = async (name: string, email: string): Promise<AffiliateUser | null> => {
  try {
    console.log('affiliateService: Attempting to register affiliate', { name, email });
    
    // Verify user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.error('affiliateService: Registration failed: User not authenticated');
      return null;
    }
    
    // Check if user is already an affiliate
    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('userId', '==', user.uid));
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
      console.log('affiliateService: Checked existing affiliate records', querySnapshot.size);
    } catch (error) {
      console.error('affiliateService: Error checking existing affiliate:', error);
      throw new Error('Failed to check existing affiliate record');
    }
    
    // If user is already an affiliate, return the existing data
    if (!querySnapshot.empty) {
      console.log('affiliateService: User is already an affiliate, returning existing data');
      const data = querySnapshot.docs[0].data() as AffiliateUser;
      return {
        id: querySnapshot.docs[0].id,
        ...data
      };
    }

    // Create new affiliate
    console.log('affiliateService: Creating new affiliate record');
    const affiliateCode = generateAffiliateCode(name);
    console.log('affiliateService: Generated affiliate code:', affiliateCode);
    
    const affiliateData: AffiliateUser = {
      userId: user.uid,
      email: email || user.email || '',
      name,
      affiliateCode,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
      createdAt: serverTimestamp()
    };

    let docRef;
    try {
      docRef = await addDoc(affiliatesRef, affiliateData);
      console.log('affiliateService: Affiliate record created with ID:', docRef.id);
    } catch (error) {
      console.error('affiliateService: Error creating affiliate record:', error);
      throw new Error('Failed to create affiliate record');
    }
    
    return {
      id: docRef.id,
      ...affiliateData
    };
  } catch (error) {
    console.error('affiliateService: Error in registerAffiliate:', error);
    return null;
  }
};

// Get affiliate data for current user - with improved error handling
export const getCurrentAffiliate = async (): Promise<AffiliateUser | null> => {
  try {
    console.log('affiliateService: Getting current affiliate data');
    
    // Verify user is authenticated
    const user = auth.currentUser;
    if (!user) {
      console.log('affiliateService: getCurrentAffiliate: No authenticated user');
      return null;
    }

    // Query for affiliate record
    const affiliatesRef = collection(db, 'affiliates');
    const q = query(affiliatesRef, where('userId', '==', user.uid));
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
      console.log('affiliateService: Affiliate query returned', querySnapshot.size, 'records');
    } catch (error) {
      console.error('affiliateService: Error querying affiliate:', error);
      throw new Error('Failed to query affiliate record');
    }
    
    if (querySnapshot.empty) {
      console.log('affiliateService: No affiliate record found for user');
      return null;
    }

    const data = querySnapshot.docs[0].data() as AffiliateUser;
    console.log('affiliateService: Found affiliate record with code:', data.affiliateCode);
    
    return {
      id: querySnapshot.docs[0].id,
      ...data
    };
  } catch (error) {
    console.error('affiliateService: Error in getCurrentAffiliate:', error);
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

// Get referrals for current affiliate - with improved error handling
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

// Get statistics for current affiliate - with improved error handling
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
