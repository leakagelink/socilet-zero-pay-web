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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
          <Link to="/admin-panel">
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-xs md:text-base text-muted-foreground">Track all your investments and P&L</p>
          </div>
        </div>

        {/* Summary Cards - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="p-2 md:p-3 bg-blue-500/20 rounded-lg md:rounded-xl">
                  <PiggyBank className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">Invested</p>
                  <p className="text-sm md:text-2xl font-bold truncate">₹{totalInvested.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg md:rounded-xl">
                  <Target className="h-4 w-4 md:h-6 md:w-6 text-purple-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">Current</p>
                  <p className="text-sm md:text-2xl font-bold truncate">₹{totalCurrentValue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${totalPnL >= 0 ? 'from-green-500/10 to-green-600/5 border-green-500/20' : 'from-red-500/10 to-red-600/5 border-red-500/20'}`}>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {totalPnL >= 0 ? (
                    <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 md:h-6 md:w-6 text-red-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">P&L</p>
                  <p className={`text-sm md:text-2xl font-bold truncate ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${totalPnLPercentage >= 0 ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : 'from-orange-500/10 to-orange-600/5 border-orange-500/20'}`}>
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center gap-2 md:gap-4">
                <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${totalPnLPercentage >= 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                  <IndianRupee className={`h-4 w-4 md:h-6 md:w-6 ${totalPnLPercentage >= 0 ? 'text-emerald-500' : 'text-orange-500'}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] md:text-sm text-muted-foreground truncate">Return</p>
                  <p className={`text-sm md:text-2xl font-bold truncate ${totalPnLPercentage >= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                    {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdowns - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-8">
          {/* By Type */}
          <Card>
            <CardHeader className="py-3 md:py-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
                By Investment Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="space-y-2 md:space-y-4">
                {Object.entries(typeBreakdown).map(([type, data]) => (
                  <div key={type} className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium capitalize text-xs md:text-sm truncate">{type.replace('_', ' ')}</p>
                      <p className="text-[10px] md:text-sm text-muted-foreground">
                        ₹{data.invested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={`font-bold text-xs md:text-base ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.pnl >= 0 ? '+' : ''}₹{data.pnl.toLocaleString('en-IN')}
                      </p>
                      <p className={`text-[10px] md:text-sm ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.invested > 0 ? ((data.pnl / data.invested) * 100).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
                {Object.keys(typeBreakdown).length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">No active investments</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* By Platform */}
          <Card>
            <CardHeader className="py-3 md:py-6">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
                By Platform
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6 pt-0">
              <div className="space-y-2 md:space-y-4">
                {Object.entries(platformBreakdown).map(([platform, data]) => (
                  <div key={platform} className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs md:text-sm truncate">{platform}</p>
                      <p className="text-[10px] md:text-sm text-muted-foreground">
                        ₹{data.invested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={`font-bold text-xs md:text-base ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.pnl >= 0 ? '+' : ''}₹{data.pnl.toLocaleString('en-IN')}
                      </p>
                      <p className={`text-[10px] md:text-sm ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.invested > 0 ? ((data.pnl / data.invested) * 100).toFixed(2) : 0}%
                      </p>
                    </div>
                  </div>
                ))}
                {Object.keys(platformBreakdown).length === 0 && (
                  <p className="text-center text-muted-foreground py-4 text-sm">No active investments</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters - Horizontal scroll on mobile */}
        <Card className="mb-4 md:mb-6">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">Filters:</span>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[100px] md:w-[150px] h-8 md:h-10 text-xs md:text-sm shrink-0">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="stocks">Stocks</SelectItem>
                  <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="fd">FD</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="bonds">Bonds</SelectItem>
                  <SelectItem value="sip">SIP</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[90px] md:w-[130px] h-8 md:h-10 text-xs md:text-sm shrink-0">
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
                <SelectTrigger className="w-[100px] md:w-[150px] h-8 md:h-10 text-xs md:text-sm shrink-0">
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
                  className="h-8 text-xs shrink-0"
                  onClick={() => {
                    setFilterType("all");
                    setFilterStatus("all");
                    setFilterPlatform("all");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investments - Table for Desktop, Cards for Mobile */}
        <Card>
          <CardHeader className="py-3 md:py-6">
            <CardTitle className="text-sm md:text-lg">All Investments ({filteredInvestments.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6 pt-0">
            {filteredInvestments.length === 0 ? (
              <div className="text-center py-8 md:py-12 text-muted-foreground">
                <PiggyBank className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm md:text-base">No investments found matching the filters.</p>
              </div>
            ) : isMobile ? (
              // Mobile Card Layout
              <div className="space-y-3">
                {filteredInvestments.map((investment) => (
                  <div 
                    key={investment.id} 
                    className="p-3 rounded-lg border bg-card"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{investment.investment_name}</p>
                        <p className="text-xs text-muted-foreground">{investment.platform} • {investment.investment_type.replace('_', ' ')}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${
                        investment.status === 'active' ? 'bg-green-500/20 text-green-500' :
                        investment.status === 'closed' ? 'bg-gray-500/20 text-gray-500' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {investment.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div>
                        <p className="text-muted-foreground">Invested</p>
                        <p className="font-medium">₹{investment.invested_amount.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current</p>
                        <p className="font-medium">₹{investment.current_value.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">P&L</p>
                        <p className={`font-semibold flex items-center gap-1 ${investment.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.profit_loss >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {investment.profit_loss >= 0 ? '+' : ''}₹{investment.profit_loss.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Return</p>
                        <p className={`font-semibold ${investment.profit_loss_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.profit_loss_percentage >= 0 ? '+' : ''}{investment.profit_loss_percentage.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t text-[10px] text-muted-foreground">
                      <span>{format(new Date(investment.investment_date), "dd MMM yyyy")}</span>
                      {investment.notes && (
                        <span className="truncate max-w-[150px]">{investment.notes}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Desktop Table Layout
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
