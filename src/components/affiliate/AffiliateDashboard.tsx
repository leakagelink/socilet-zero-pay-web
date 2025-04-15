
import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  LogOut, Copy, CheckCircle, Users, DollarSign, 
  Clock, BarChart3, Link as LinkIcon, Clipboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from '../Header';
import Footer from '../Footer';
import SupportBar from '../SupportBar';
import WhatsAppButton from '../WhatsAppButton';
import { toast } from 'sonner';

// Mock data for referrals (in real implementation, this would come from API/backend)
const mockReferrals = [
  {
    id: 1,
    clientName: "Vivek Sharma",
    projectType: "Website Development",
    status: "Completed",
    budget: 15000,
    commission: 1500,
    date: "2025-03-15",
    completionDate: "2025-04-05",
    paymentDate: "2025-04-26",
  },
  {
    id: 2,
    clientName: "Rahul Patel",
    projectType: "App Development",
    status: "In Progress",
    budget: 35000,
    commission: 3500,
    date: "2025-03-28",
  },
  {
    id: 3,
    clientName: "Priya Verma",
    projectType: "Website Development",
    status: "Pending",
    budget: 12000,
    commission: 1200,
    date: "2025-04-10",
  },
];

// Status badge colors
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
};

interface AffiliateDashboardProps {
  onLogout: () => void;
}

const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({ onLogout }) => {
  const [referrals, setReferrals] = useState(mockReferrals);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // For demo: Calculate statistics based on mock data
  const totalReferrals = referrals.length;
  const pendingReferrals = referrals.filter(r => r.status === "Pending").length;
  const inProgressReferrals = referrals.filter(r => r.status === "In Progress").length;
  const completedReferrals = referrals.filter(r => r.status === "Completed").length;
  
  const totalEarned = referrals
    .filter(r => r.status === "Completed")
    .reduce((sum, r) => sum + r.commission, 0);
  
  const pendingEarnings = referrals
    .filter(r => r.status !== "Completed")
    .reduce((sum, r) => sum + r.commission, 0);

  useEffect(() => {
    // Load user data from localStorage (in real app, this would be from an API)
    const storedUser = localStorage.getItem('affiliateUser');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const copyReferralLink = () => {
    // In a real implementation, each affiliate would have a unique link
    const link = `https://socilet.com/refer/${userData?.referralId || 'demo'}`;
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopySuccess(false), 3000);
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Affiliate Dashboard | Socilet</title>
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userData.name}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="referrals">My Referrals</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Your Referral Link</CardTitle>
                    <CardDescription>Share this link to earn commissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 bg-gray-100 p-3 rounded text-sm truncate">
                        <LinkIcon className="h-4 w-4 inline-block mr-2 text-gray-500" />
                        socilet.com/refer/{userData.referralId}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={copyReferralLink}
                        className="flex items-center gap-1"
                      >
                        {copySuccess ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Member since:</span>
                      <span className="font-medium">
                        {new Date(userData.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Earnings Overview</CardTitle>
                    <CardDescription>Your current earnings and balance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Total Earned:</span>
                      <span className="text-lg font-bold">₹{totalEarned.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Pending Earnings:</span>
                      <span className="text-lg font-medium">₹{pendingEarnings.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Withdrawable:</span>
                      <span className="text-lg font-medium">₹{totalEarned.toLocaleString()}</span>
                    </div>
                    
                    <Button className="w-full mt-2" disabled={totalEarned < 500}>
                      {totalEarned < 500 
                        ? `₹${(500 - totalEarned).toLocaleString()} more to reach minimum withdrawal` 
                        : "Request Payout"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Referrals</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-gray-500" />
                      <span className="text-2xl font-bold">{totalReferrals}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">{pendingReferrals}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold">{inProgressReferrals}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">{completedReferrals}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                  <CardDescription>Your most recent client referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Project Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.slice(0, 5).map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">{referral.clientName}</TableCell>
                          <TableCell>{referral.projectType}</TableCell>
                          <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[referral.status as keyof typeof statusColors]}>
                              {referral.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">₹{referral.commission.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="referrals">
              <Card>
                <CardHeader>
                  <CardTitle>All Referrals</CardTitle>
                  <CardDescription>Complete history of your referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Project Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell className="font-medium">{referral.clientName}</TableCell>
                          <TableCell>{referral.projectType}</TableCell>
                          <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[referral.status as keyof typeof statusColors]}>
                              {referral.status}
                            </Badge>
                          </TableCell>
                          <TableCell>₹{referral.budget.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₹{referral.commission.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Summary</CardTitle>
                    <CardDescription>Overview of your earnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Earned</span>
                        <span className="font-medium">₹{totalEarned.toLocaleString()}</span>
                      </div>
                      <Progress value={(totalEarned / (totalEarned + pendingEarnings) * 100) || 0} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pending Earnings</span>
                        <span className="font-medium">₹{pendingEarnings.toLocaleString()}</span>
                      </div>
                      <Progress value={(pendingEarnings / (totalEarned + pendingEarnings) * 100) || 0} />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Withdrawable Balance</span>
                        <span className="text-xl font-bold">₹{totalEarned.toLocaleString()}</span>
                      </div>
                      
                      <Button className="w-full" disabled={totalEarned < 500}>
                        {totalEarned < 500 
                          ? `₹${(500 - totalEarned).toLocaleString()} more to reach minimum withdrawal` 
                          : "Request Payout"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Earning Rules</CardTitle>
                    <CardDescription>How commissions are calculated and paid</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Clipboard className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Commission Rates</h4>
                        <p className="text-gray-500 text-sm">10% of the project value for all successfully completed projects.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Payment Timeline</h4>
                        <p className="text-gray-500 text-sm">Commissions are released 21 days after project completion.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <DollarSign className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Minimum Payout</h4>
                        <p className="text-gray-500 text-sm">The minimum withdrawable amount is ₹500. Payouts are processed within 7 working days.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Commission History</CardTitle>
                  <CardDescription>Complete record of your commission earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Project Type</TableHead>
                        <TableHead>Completion Date</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead className="text-right">Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals
                        .filter(r => r.status === "Completed")
                        .map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell className="font-medium">{referral.clientName}</TableCell>
                            <TableCell>{referral.projectType}</TableCell>
                            <TableCell>{referral.completionDate}</TableCell>
                            <TableCell>{referral.paymentDate}</TableCell>
                            <TableCell className="text-right">₹{referral.commission.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <SupportBar />
      <WhatsAppButton />
    </>
  );
};

export default AffiliateDashboard;
