
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AffiliateUser, ReferralProject, AffiliateStats } from '@/services/affiliateService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Link,
  TrendingUp,
  DollarSign,
  BadgePercent,
  Calendar,
  FileText,
  Info
} from "lucide-react";

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
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const affiliateLink = getAffiliateLink(affiliate.affiliateCode);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast({
      title: 'Link Copied',
      description: 'Affiliate link copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'started': return 'text-blue-600 bg-blue-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Affiliate Dashboard</h2>
        <Button onClick={onRefresh} variant="outline">Refresh Data</Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Your Affiliate Link</CardTitle>
          <CardDescription>
            Share this link with potential clients to earn commission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="bg-muted p-2 rounded flex-1 text-sm overflow-hidden">
              <div className="truncate">{affiliateLink}</div>
            </div>
            <Button 
              onClick={copyToClipboard}
              size="sm"
              className={copied ? "bg-green-600" : ""}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-medium">Your Code:</span> {affiliate.affiliateCode}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Referrals"
          value={stats.totalReferrals.toString()}
          icon={<Users className="h-4 w-4" />}
          description="Total number of referrals"
          className="bg-blue-50"
        />
        <StatsCard
          title="Active Projects"
          value={stats.startedProjects.toString()}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Projects in progress"
          className="bg-green-50"
        />
        <StatsCard
          title="Complete Projects"
          value={stats.completedProjects.toString()}
          icon={<BadgePercent className="h-4 w-4" />}
          description="Successfully completed"
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
      
      <Tabs defaultValue="referrals">
        <TabsList className="mb-4">
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="reseller">Reseller Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="referrals" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="reseller" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Reseller Program</CardTitle>
              <CardDescription>
                Sell our services at your own price
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" /> How It Works
                </h3>
                <p className="text-sm">
                  As a reseller, you can market our services under your own brand and set your own prices. Instead of earning 25% commission, you keep the difference between our price and your selling price.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Our Service Prices (Your Cost):</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PriceCard 
                    title="Website Development" 
                    price="₹15,000" 
                    features={["Custom design", "Mobile responsive", "5 pages"]} 
                  />
                  <PriceCard 
                    title="E-commerce Website" 
                    price="₹30,000" 
                    features={["Product management", "Payment integration", "10 pages"]} 
                  />
                  <PriceCard 
                    title="Mobile App Development" 
                    price="₹40,000" 
                    features={["iOS & Android", "User authentication", "Basic features"]} 
                  />
                  <PriceCard 
                    title="SEO Package" 
                    price="₹10,000" 
                    features={["Keyword research", "On-page optimization", "Monthly report"]} 
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Example Markup:</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you sell a Website Development package for ₹25,000 (your cost: ₹15,000), you keep ₹10,000 profit instead of earning just ₹3,750 (25% commission).
                </p>
                
                <Button variant="outline">
                  Download Price List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

type StatsCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  className?: string;
};

const StatsCard = ({ title, value, icon, description, className }: StatsCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className={`p-4 rounded-lg border ${className || ""}`}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="p-2 rounded-full bg-white">{icon}</div>
    </div>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </motion.div>
);

type PriceCardProps = {
  title: string;
  price: string;
  features: string[];
};

const PriceCard = ({ title, price, features }: PriceCardProps) => (
  <div className="border rounded-lg p-4">
    <h3 className="font-medium">{title}</h3>
    <p className="text-xl font-bold my-2">{price}</p>
    <ul className="text-sm space-y-1">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

export default AffiliateDashboard;
