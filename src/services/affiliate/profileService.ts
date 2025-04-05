
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
import { AffiliateUser } from './types';
import { generateAffiliateCode } from './utils';

/**
 * Register a new affiliate
 */
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

/**
 * Get affiliate data for current user
 */
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

/**
 * Get affiliate by code
 */
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
    
    const affiliate = affiliateSnap.data() as AffiliateUser;
    
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
