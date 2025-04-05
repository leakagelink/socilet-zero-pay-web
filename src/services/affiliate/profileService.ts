
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
import { db, auth } from '../../lib/firebase';
import { AffiliateProfile } from './types';
import { generateUniqueCode } from './utils';

/**
 * Get affiliate profile for current user
 */
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

/**
 * Register a new affiliate
 */
export const registerAffiliate = async (name: string, email: string): Promise<AffiliateProfile | null> => {
  try {
    console.log('affiliateProgram: Starting affiliate registration process');
    const user = auth.currentUser;
    if (!user) {
      console.error('affiliateProgram: Registration failed - user not authenticated');
      throw new Error('User not authenticated');
    }

    // Check if already registered
    const existingProfile = await getAffiliateProfile();
    if (existingProfile) {
      console.log('affiliateProgram: User already registered as affiliate');
      return existingProfile;
    }

    // Create new profile
    const affiliateCode = generateUniqueCode(name);
    console.log('affiliateProgram: Generated affiliate code:', affiliateCode);
    
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

    console.log('affiliateProgram: Creating new affiliate profile with data:', JSON.stringify(profileData));
    const affiliatesRef = collection(db, 'affiliates');
    const docRef = await addDoc(affiliatesRef, profileData);
    console.log('affiliateProgram: Created affiliate profile with ID:', docRef.id);
    
    return {
      id: docRef.id,
      ...profileData
    };
  } catch (error) {
    console.error('Error registering affiliate:', error);
    throw error; // Rethrow to allow proper error handling in the hook
  }
};

/**
 * Get affiliate by code (for tracking referrals)
 */
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

/**
 * Process a payment to affiliate
 */
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
