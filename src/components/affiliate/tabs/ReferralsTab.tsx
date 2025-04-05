
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, FileText } from "lucide-react";
import { AffiliateReferral } from '@/services/affiliate';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';

type ReferralsTabProps = {
  referrals: AffiliateReferral[];
};

const ReferralsTab = ({ referrals }: ReferralsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Your Referrals
        </CardTitle>
        <CardDescription>
          Track the status of all your referred clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {referrals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.clientName}</TableCell>
                  <TableCell>{referral.projectName || "Not specified"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(referral.status)}`}>
                      {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(referral.createdAt)}</TableCell>
                  <TableCell>
                    {referral.commissionAmount 
                      ? formatCurrency(referral.commissionAmount)
                      : referral.isReseller 
                        ? "Reseller (Your Margin)"
                        : `${(referral.commissionRate * 100)}%`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="mb-2">No referrals yet</p>
            <p className="text-sm">Start sharing your affiliate link to earn commissions!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralsTab;
