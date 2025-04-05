
// Types for the affiliate system

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
