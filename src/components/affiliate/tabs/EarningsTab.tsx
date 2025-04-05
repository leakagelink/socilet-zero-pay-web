
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, BadgePercent, TrendingUp } from "lucide-react";
import { AffiliateStats } from '@/services/affiliateService';
import StatsCard from '../ui/StatsCard';
import { formatCurrency } from '../utils/formatters';

type EarningsTabProps = {
  stats: AffiliateStats;
};

const EarningsTab = ({ stats }: EarningsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(stats.totalEarnings)}
          icon={<DollarSign className="h-4 w-4" />}
          description="All-time earnings"
          className="bg-amber-50"
        />
        <StatsCard
          title="Pending Payment"
          value={formatCurrency(stats.pendingEarnings)}
          icon={<Calendar className="h-4 w-4" />}
          description="To be paid"
          className="bg-blue-50"
        />
        <StatsCard
          title="Paid Amount"
          value={formatCurrency(stats.paidEarnings)}
          icon={<BadgePercent className="h-4 w-4" />}
          description="Already paid"
          className="bg-green-50"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Commission Structure</CardTitle>
          <CardDescription>
            How you earn with our affiliate program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <BadgePercent className="h-4 w-4" /> Standard Referral
              </h3>
              <p className="text-sm text-muted-foreground">
                Earn 25% commission on the total project value when you refer a client who completes a project.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Reseller Program
              </h3>
              <p className="text-sm text-muted-foreground">
                As a reseller, you can set your own prices, but no additional commission is provided. You keep the margin between our price and your selling price.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Payment Schedule
              </h3>
              <p className="text-sm text-muted-foreground">
                Commissions are calculated when a project is marked as completed. Payments are processed on a monthly basis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsTab;
