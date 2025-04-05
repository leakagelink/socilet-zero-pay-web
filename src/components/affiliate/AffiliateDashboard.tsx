
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AffiliateProfile, AffiliateReferral, AffiliateStatistics } from '@/services/affiliate';
import AffiliateLinkCard from './AffiliateLinkCard';
import AffiliateStatsComponent from './AffiliateStats';
import ReferralsTab from './tabs/ReferralsTab';
import EarningsTab from './tabs/EarningsTab';
import ResellerTab from './tabs/ResellerTab';

type AffiliateDashboardProps = {
  profile: AffiliateProfile;
  referrals: AffiliateReferral[];
  stats: AffiliateStatistics;
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  generateAffiliateLink: (code: string) => string;
};

const AffiliateDashboard = ({ 
  profile, 
  referrals, 
  stats, 
  onRefresh,
  isLoading,
  generateAffiliateLink
}: AffiliateDashboardProps) => {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Affiliate Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {profile.name}
          </p>
        </div>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : "Refresh Data"}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your affiliate data...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <AffiliateLinkCard 
            affiliateCode={profile.affiliateCode} 
            getAffiliateLink={generateAffiliateLink} 
          />
          
          <AffiliateStatsComponent stats={stats} />
          
          <Tabs defaultValue="referrals">
            <TabsList className="mb-4">
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="reseller">Reseller Program</TabsTrigger>
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
        </motion.div>
      )}
    </div>
  );
};

export default AffiliateDashboard;
