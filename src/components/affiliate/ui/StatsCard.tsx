
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  description: string;
  className?: string;
};

const StatsCard = ({ title, value, icon, description, className = "" }: StatsCardProps) => (
  <Card className={className}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;
