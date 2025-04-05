
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar, BadgePercent, TrendingUp, Clock } from "lucide-react";
import { AffiliateStatistics } from '@/services/affiliateProgram';
import StatsCard from '../ui/StatsCard';
import { formatCurrency } from '../utils/formatters';

type EarningsTabProps = {
  stats: AffiliateStatistics;
};

const EarningsTab = ({ stats }: EarningsTabProps) => {
  return (
    <div className="space-y-6">
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
          icon={<Clock className="h-4 w-4" />}
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
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Commission Structure
          </CardTitle>
          <CardDescription>
            How you earn with our affiliate program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <BadgePercent className="h-4 w-4" /> Standard Referral (25% Commission)
              </h3>
              <p className="text-sm text-muted-foreground">
                Earn 25% commission on the total project value when you refer a client who completes a project with us.
                Your commission is calculated and credited to your account once the project is completed.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Reseller Program (Set Your Prices)
              </h3>
              <p className="text-sm text-muted-foreground">
                As a reseller, you can set your own prices for our services and keep the margin. 
                You'll purchase services from us at wholesale rates and resell them at your determined retail price.
              </p>
            </div>
            
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Payment Schedule
              </h3>
              <p className="text-sm text-muted-foreground">
                We process affiliate payments on a monthly basis. Once your account has at least ₹5,000 in pending 
                earnings, you'll receive payment by the 10th of the following month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsTab;
