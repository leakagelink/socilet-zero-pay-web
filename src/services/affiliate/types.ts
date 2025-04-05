
// Types for the affiliate program

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
