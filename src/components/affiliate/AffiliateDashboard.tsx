import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, FileText, TrendingUp } from "lucide-react";
import ReferredProjectForm from './ReferredProjectForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AffiliateDashboard = () => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load affiliate data and referrals
  useEffect(() => {
    if (user) {
      loadAffiliateData();
      loadReferrals();
    }
  }, [user]);

  const loadAffiliateData = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_users')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setAffiliateData(data);
    } catch (error: any) {
      console.error('Error loading affiliate data:', error);
      toast.error('Failed to load affiliate data');
    }
  };

  const loadReferrals = async () => {
    try {
      const { data: affiliateUser } = await supabase
        .from('affiliate_users')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (affiliateUser) {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('affiliate_id', affiliateUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReferrals(data || []);
      }
    } catch (error: any) {
      console.error('Error loading referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalReferrals: affiliateData?.total_referrals || 0,
    totalEarnings: affiliateData?.total_earnings || 0,
    pendingCommissions: referrals.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.commission_amount || 0), 0),
    completedProjects: referrals.filter(r => r.status === 'completed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Dashboard</h1>
        <p className="text-gray-600">Track your referrals and earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.pendingCommissions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Project Button */}
      <div className="mb-8">
        <Button onClick={() => setShowProjectForm(true)}>
          Refer New Project
        </Button>
      </div>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Your referral commission history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{referral.client_name}</h4>
                    <p className="text-sm text-gray-600">{referral.project_type}</p>
                    <p className="text-xs text-gray-500">{new Date(referral.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(referral.status)}>
                      {referral.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">₹{(referral.commission_amount || 0).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No referrals yet. Start referring projects to earn commissions!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ReferredProjectForm 
          onClose={() => setShowProjectForm(false)}
          onSubmit={async (data) => {
            try {
              if (!affiliateData) {
                toast.error('Affiliate data not found');
                return;
              }

              const { error } = await supabase
                .from('referrals')
                .insert({
                  affiliate_id: affiliateData.id,
                  project_name: data.projectName,
                  project_type: data.projectType,
                  client_name: data.clientName,
                  client_email: data.clientEmail,
                  client_phone: data.clientPhone,
                  project_budget: data.projectBudget,
                  project_description: data.projectDescription,
                });

              if (error) throw error;

              toast.success('Project referred successfully!');
              setShowProjectForm(false);
              loadReferrals();
            } catch (error: any) {
              toast.error('Failed to submit referral: ' + error.message);
            }
          }}
        />
      )}
    </div>
  );
};

export default AffiliateDashboard;