import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ArrowLeft, TrendingUp, TrendingDown, PiggyBank, Target, IndianRupee, BarChart3, Filter } from "lucide-react";
import { Link } from "react-router-dom";

interface Investment {
  id: string;
  investment_name: string;
  platform: string;
  investment_type: string;
  invested_amount: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  investment_date: string;
  status: string;
  notes: string | null;
}

const Investments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .order("investment_date", { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique platforms
  const platforms = [...new Set(investments.map(inv => inv.platform))];

  // Filter investments
  const filteredInvestments = investments.filter(inv => {
    if (filterType !== "all" && inv.investment_type !== filterType) return false;
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    if (filterPlatform !== "all" && inv.platform !== filterPlatform) return false;
    return true;
  });

  // Calculate totals for filtered investments
  const activeFiltered = filteredInvestments.filter(inv => inv.status === 'active');
  const totalInvested = activeFiltered.reduce((sum, inv) => sum + inv.invested_amount, 0);
  const totalCurrentValue = activeFiltered.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalPnLPercentage = totalInvested > 0 ? ((totalPnL / totalInvested) * 100) : 0;

  // Group by investment type for breakdown
  const typeBreakdown = filteredInvestments.reduce((acc, inv) => {
    if (inv.status !== 'active') return acc;
    if (!acc[inv.investment_type]) {
      acc[inv.investment_type] = { invested: 0, current: 0, pnl: 0 };
    }
    acc[inv.investment_type].invested += inv.invested_amount;
    acc[inv.investment_type].current += inv.current_value;
    acc[inv.investment_type].pnl += inv.profit_loss;
    return acc;
  }, {} as Record<string, { invested: number; current: number; pnl: number }>);

  // Group by platform for breakdown
  const platformBreakdown = filteredInvestments.reduce((acc, inv) => {
    if (inv.status !== 'active') return acc;
    if (!acc[inv.platform]) {
      acc[inv.platform] = { invested: 0, current: 0, pnl: 0 };
    }
    acc[inv.platform].invested += inv.invested_amount;
    acc[inv.platform].current += inv.current_value;
    acc[inv.platform].pnl += inv.profit_loss;
    return acc;
  }, {} as Record<string, { invested: number; current: number; pnl: number }>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg">Loading investments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin-panel">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-muted-foreground">Track all your investments and P&L</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <PiggyBank className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                  <p className="text-2xl font-bold">₹{totalInvested.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Target className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-2xl font-bold">₹{totalCurrentValue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${totalPnL >= 0 ? 'from-green-500/10 to-green-600/5 border-green-500/20' : 'from-red-500/10 to-red-600/5 border-red-500/20'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {totalPnL >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${totalPnLPercentage >= 0 ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : 'from-orange-500/10 to-orange-600/5 border-orange-500/20'}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${totalPnLPercentage >= 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                  <IndianRupee className={`h-6 w-6 ${totalPnLPercentage >= 0 ? 'text-emerald-500' : 'text-orange-500'}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Return</p>
                  <p className={`text-2xl font-bold ${totalPnLPercentage >= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* By Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                By Investment Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(typeBreakdown).map(([type, data]) => (
                  <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        Invested: ₹{data.invested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.pnl >= 0 ? '+' : ''}₹{data.pnl.toLocaleString('en-IN')}
                      </p>
                      <p className={`text-sm ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.invested > 0 ? ((data.pnl / data.invested) * 100).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
                {Object.keys(typeBreakdown).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active investments</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* By Platform */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                By Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(platformBreakdown).map(([platform, data]) => (
                  <div key={platform} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{platform}</p>
                      <p className="text-sm text-muted-foreground">
                        Invested: ₹{data.invested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.pnl >= 0 ? '+' : ''}₹{data.pnl.toLocaleString('en-IN')}
                      </p>
                      <p className={`text-sm ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.invested > 0 ? ((data.pnl / data.invested) * 100).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
                {Object.keys(platformBreakdown).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active investments</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="fd">Fixed Deposit</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="sip">SIP</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(filterType !== "all" || filterStatus !== "all" || filterPlatform !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setFilterType("all");
                    setFilterStatus("all");
                    setFilterPlatform("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Investments ({filteredInvestments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInvestments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No investments found matching the filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment Name</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Invested</TableHead>
                      <TableHead className="text-right">Current Value</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                      <TableHead className="text-right">P&L %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvestments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{investment.investment_name}</p>
                            {investment.notes && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {investment.notes}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{investment.platform}</TableCell>
                        <TableCell className="capitalize">{investment.investment_type.replace('_', ' ')}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{investment.invested_amount.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{investment.current_value.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${investment.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          <div className="flex items-center justify-end gap-1">
                            {investment.profit_loss >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                            {investment.profit_loss >= 0 ? '+' : ''}₹{investment.profit_loss.toLocaleString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${investment.profit_loss_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.profit_loss_percentage >= 0 ? '+' : ''}{investment.profit_loss_percentage.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            investment.status === 'active' ? 'bg-green-500/20 text-green-500' :
                            investment.status === 'closed' ? 'bg-gray-500/20 text-gray-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {investment.status}
                          </span>
                        </TableCell>
                        <TableCell>{format(new Date(investment.investment_date), "dd MMM yyyy")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Investments;
