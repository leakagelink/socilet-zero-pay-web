
import React from 'react';
import { Users, TrendingUp, BadgePercent, DollarSign } from "lucide-react";
import { AffiliateStatistics } from '@/services/affiliateProgram';
import StatsCard from './ui/StatsCard';
import { formatCurrency } from './utils/formatters';

type AffiliateStatsProps = {
  stats: AffiliateStatistics;
};

const AffiliateStats = ({ stats }: AffiliateStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Referrals"
        value={stats.totalReferrals.toString()}
        icon={<Users className="h-4 w-4" />}
        description="All clients referred"
        className="bg-blue-50"
      />
      <StatsCard
        title="Active Projects"
        value={stats.activeProjects.toString()}
        icon={<TrendingUp className="h-4 w-4" />}
        description="Projects in progress"
        className="bg-green-50"
      />
      <StatsCard
        title="Completed Projects"
        value={stats.completedProjects.toString()}
        icon={<BadgePercent className="h-4 w-4" />}
        description="Successfully delivered"
        className="bg-purple-50"
      />
      <StatsCard
        title="Total Earnings"
        value={formatCurrency(stats.totalEarnings)}
        icon={<DollarSign className="h-4 w-4" />}
        description="Commission earned"
        className="bg-amber-50"
      />
    </div>
  );
};

export default AffiliateStats;
