
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";
import { ReferralProject } from '@/services/affiliateService';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';

type ReferralsTabProps = {
  referrals: ReferralProject[];
};

const ReferralsTab = ({ referrals }: ReferralsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Your Referrals</CardTitle>
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
                  <TableCell>{referral.referredName}</TableCell>
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
                      : referral.isResale 
                        ? "Resale (0%)"
                        : "Pending"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No referrals yet. Start sharing your affiliate link!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralsTab;
