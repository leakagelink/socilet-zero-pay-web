
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AffiliateUser, ReferralProject, AffiliateStats } from '@/services/affiliateService';

// Import our new components
import AffiliateLinkCard from './AffiliateLinkCard';
import AffiliateStatsComponent from './AffiliateStats';
import ReferralsTab from './tabs/ReferralsTab';
import EarningsTab from './tabs/EarningsTab';
import ResellerTab from './tabs/ResellerTab';

type AffiliateDashboardProps = {
  affiliate: AffiliateUser;
  referrals: ReferralProject[];
  stats: AffiliateStats;
  getAffiliateLink: (code: string) => string;
  onRefresh: () => Promise<void>;
};

const AffiliateDashboard = ({ 
  affiliate, 
  referrals, 
  stats, 
  getAffiliateLink,
  onRefresh
}: AffiliateDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Affiliate Dashboard</h2>
        <Button onClick={onRefresh} variant="outline">Refresh Data</Button>
      </div>
      
      <AffiliateLinkCard 
        affiliateCode={affiliate.affiliateCode} 
        getAffiliateLink={getAffiliateLink} 
      />
      
      <AffiliateStatsComponent stats={stats} />
      
      <Tabs defaultValue="referrals">
        <TabsList className="mb-4">
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="reseller">Reseller Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="referrals" className="space-y-4">
          <ReferralsTab referrals={referrals} />
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-4">
          <EarningsTab stats={stats} />
        </TabsContent>
        
        <TabsContent value="reseller" className="space-y-4">
          <ResellerTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliateDashboard;
