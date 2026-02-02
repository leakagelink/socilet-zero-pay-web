import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, ExternalLink, IndianRupee, Target, PiggyBank } from "lucide-react";
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
  created_at: string;
}

const InvestmentManager = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    investment_name: "",
    platform: "",
    investment_type: "stocks",
    invested_amount: "",
    current_value: "",
    investment_date: format(new Date(), "yyyy-MM-dd"),
    status: "active",
    notes: "",
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .order("created_at", { ascending: false });

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

  const resetForm = () => {
    setFormData({
      investment_name: "",
      platform: "",
      investment_type: "stocks",
      invested_amount: "",
      current_value: "",
      investment_date: format(new Date(), "yyyy-MM-dd"),
      status: "active",
      notes: "",
    });
    setEditingInvestment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const investmentData = {
        investment_name: formData.investment_name,
        platform: formData.platform,
        investment_type: formData.investment_type,
        invested_amount: parseFloat(formData.invested_amount) || 0,
        current_value: parseFloat(formData.current_value) || 0,
        investment_date: formData.investment_date,
        status: formData.status,
        notes: formData.notes || null,
      };

      if (editingInvestment) {
        const { error } = await supabase
          .from("investments")
          .update(investmentData)
          .eq("id", editingInvestment.id);

        if (error) throw error;
        toast({ title: "Investment updated successfully!" });
      } else {
        const { error } = await supabase
          .from("investments")
          .insert([investmentData]);

        if (error) throw error;
        toast({ title: "Investment added successfully!" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchInvestments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setFormData({
      investment_name: investment.investment_name,
      platform: investment.platform,
      investment_type: investment.investment_type,
      invested_amount: investment.invested_amount.toString(),
      current_value: investment.current_value.toString(),
      investment_date: investment.investment_date,
      status: investment.status,
      notes: investment.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investment?")) return;

    try {
      const { error } = await supabase
        .from("investments")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Investment deleted successfully!" });
      fetchInvestments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.invested_amount, 0);
  const totalCurrentValue = activeInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalPnLPercentage = totalInvested > 0 ? ((totalPnL / totalInvested) * 100) : 0;

  if (loading) {
    return <div className="flex justify-center p-8">Loading investments...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <PiggyBank className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-bold">₹{totalInvested.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-bold">₹{totalCurrentValue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${totalPnL >= 0 ? 'from-green-500/10 to-green-600/5 border-green-500/20' : 'from-red-500/10 to-red-600/5 border-red-500/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${totalPnL >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {totalPnL >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${totalPnLPercentage >= 0 ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : 'from-orange-500/10 to-orange-600/5 border-orange-500/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${totalPnLPercentage >= 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                <IndianRupee className={`h-5 w-5 ${totalPnLPercentage >= 0 ? 'text-emerald-500' : 'text-orange-500'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">P&L %</p>
                <p className={`text-xl font-bold ${totalPnLPercentage >= 0 ? 'text-emerald-500' : 'text-orange-500'}`}>
                  {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingInvestment ? "Edit Investment" : "Add New Investment"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investment_name">Investment Name *</Label>
                  <Input
                    id="investment_name"
                    value={formData.investment_name}
                    onChange={(e) => setFormData({ ...formData, investment_name: e.target.value })}
                    placeholder="e.g., Reliance Industries"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Input
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="e.g., Zerodha, Groww, Angel One"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment_type">Investment Type</Label>
                  <Select
                    value={formData.investment_type}
                    onValueChange={(value) => setFormData({ ...formData, investment_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invested_amount">Invested Amount (₹) *</Label>
                    <Input
                      id="invested_amount"
                      type="number"
                      value={formData.invested_amount}
                      onChange={(e) => setFormData({ ...formData, invested_amount: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current_value">Current Value (₹) *</Label>
                    <Input
                      id="current_value"
                      type="number"
                      value={formData.current_value}
                      onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment_date">Investment Date</Label>
                    <Input
                      id="investment_date"
                      type="date"
                      value={formData.investment_date}
                      onChange={(e) => setFormData({ ...formData, investment_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingInvestment ? "Update Investment" : "Add Investment"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Link to="/investments">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View All Investments
            </Button>
          </Link>
        </div>
      </div>

      {/* Investments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Investments ({investments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No investments found. Add your first investment!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                    <TableHead className="text-right">Current Value</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                    <TableHead className="text-right">P&L %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.investment_name}</TableCell>
                      <TableCell>{investment.platform}</TableCell>
                      <TableCell className="capitalize">{investment.investment_type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right">₹{investment.invested_amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right">₹{investment.current_value.toLocaleString('en-IN')}</TableCell>
                      <TableCell className={`text-right font-medium ${investment.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {investment.profit_loss >= 0 ? '+' : ''}₹{investment.profit_loss.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${investment.profit_loss_percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(investment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(investment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentManager;
