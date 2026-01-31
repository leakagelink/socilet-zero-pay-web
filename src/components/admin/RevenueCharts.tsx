import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Loader2 } from 'lucide-react';

interface MonthlyData {
  month: string;
  projects: number;
  digital: number;
  other: number;
  total: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#10b981'];

const RevenueCharts = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch projects data
      const { data: projects } = await supabase
        .from('projects')
        .select('advance_amount, created_at');

      // Fetch digital products data
      const { data: digitalProducts } = await supabase
        .from('digital_products')
        .select('resell_price, sale_date');

      // Fetch other income data
      const { data: otherIncomes } = await supabase
        .from('other_income')
        .select('amount, payment_date, status');

      // Process monthly data for last 6 months
      const months = getLastSixMonths();
      const monthlyStats: MonthlyData[] = months.map(month => {
        const monthStart = new Date(month.year, month.monthIndex, 1);
        const monthEnd = new Date(month.year, month.monthIndex + 1, 0);

        const projectsTotal = projects?.filter(p => {
          const date = new Date(p.created_at);
          return date >= monthStart && date <= monthEnd;
        }).reduce((sum, p) => sum + (p.advance_amount || 0), 0) || 0;

        const digitalTotal = digitalProducts?.filter(p => {
          const date = new Date(p.sale_date);
          return date >= monthStart && date <= monthEnd;
        }).reduce((sum, p) => sum + (p.resell_price || 0), 0) || 0;

        const otherTotal = otherIncomes?.filter(o => {
          const date = new Date(o.payment_date);
          return date >= monthStart && date <= monthEnd && o.status === 'Paid';
        }).reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

        return {
          month: month.label,
          projects: projectsTotal,
          digital: digitalTotal,
          other: otherTotal,
          total: projectsTotal + digitalTotal + otherTotal,
        };
      });

      setMonthlyData(monthlyStats);

      // Calculate category totals for pie chart
      const totalProjects = projects?.reduce((sum, p) => sum + (p.advance_amount || 0), 0) || 0;
      const totalDigital = digitalProducts?.reduce((sum, p) => sum + (p.resell_price || 0), 0) || 0;
      const totalOther = otherIncomes?.filter(o => o.status === 'Paid').reduce((sum, o) => sum + (o.amount || 0), 0) || 0;

      setCategoryData([
        { name: 'Projects', value: totalProjects, color: '#3b82f6' },
        { name: 'Digital Products', value: totalDigital, color: '#8b5cf6' },
        { name: 'Other Income', value: totalOther, color: '#f97316' },
      ].filter(item => item.value > 0));

    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLastSixMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleDateString('en-IN', { month: 'short' }),
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    
    return months;
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm" style={{ color: data.payload.color }}>
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="border border-slate-200 dark:border-slate-800">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Revenue Analytics</h2>
          <p className="text-sm text-muted-foreground">Monthly trends & breakdown</p>
        </div>
      </div>

      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
          <TabsTrigger value="bar" className="flex items-center gap-2 text-xs sm:text-sm">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Bar Chart</span>
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2 text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trend Line</span>
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2 text-xs sm:text-sm">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Distribution</span>
          </TabsTrigger>
        </TabsList>

        {/* Bar Chart */}
        <TabsContent value="bar">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Monthly Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tickFormatter={formatCurrency}
                      tick={{ fontSize: 11 }}
                      width={50}
                      className="text-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="projects" name="Projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="digital" name="Digital" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="other" name="Other" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Line Chart */}
        <TabsContent value="line">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Revenue Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tickFormatter={formatCurrency}
                      tick={{ fontSize: 11 }}
                      width={50}
                      className="text-muted-foreground"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      name="Total Revenue"
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projects" 
                      name="Projects"
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pie Chart */}
        <TabsContent value="pie">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] sm:h-[350px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend 
                        formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueCharts;
