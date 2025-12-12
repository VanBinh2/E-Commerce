import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  DollarSign, ShoppingBag, Users, Package, 
  TrendingUp, TrendingDown, ArrowUpRight, Activity, MousePointerClick, UserPlus
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/Shared';
import { api } from '../../services/mockBackend';

// --- UI Components ---
const KPICard = ({ title, value, trend, icon: Icon, color }: any) => {
  const isPositive = trend >= 0;
  
  // Minimal Color Palette
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    purple: "text-violet-600 bg-violet-50",
    orange: "text-orange-600 bg-orange-50",
    gray: "text-gray-600 bg-gray-50"
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow duration-200 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-lg ${colors[color as keyof typeof colors] || colors.gray}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
             {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
             {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      </div>
    </Card>
  );
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock Chart Data
  const COLORS = ['#111827', '#6B7280', '#E5E7EB', '#F3F4F6']; // Minimal Greyscale + Accent
  
  const conversionData = [
    { name: 'Mon', visits: 1200, orders: 45, rate: 3.7 },
    { name: 'Tue', visits: 1400, orders: 55, rate: 3.9 },
    { name: 'Wed', visits: 1100, orders: 40, rate: 3.6 },
    { name: 'Thu', visits: 1600, orders: 80, rate: 5.0 },
    { name: 'Fri', visits: 1800, orders: 95, rate: 5.2 },
    { name: 'Sat', visits: 2200, orders: 120, rate: 5.4 },
    { name: 'Sun', visits: 2000, orders: 110, rate: 5.5 },
  ];

  useEffect(() => {
    // Simulate fetching enterprise analytics
    api.getAnalyticsData().then((res) => {
      // Merging real mock response with extended simulated data
      setData({
        ...res,
        kpi: {
          revenue: 125430,
          orders: 1240,
          customers: 3405,
          products: 156,
          aov: 101.15, // Average Order Value
          conversion: 4.8, // Conversion Rate
          cac: 12.50 // Customer Acquisition Cost
        }
      });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Performance metrics and store overview.</p>
        </div>
        <div className="flex gap-2">
           <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900 block p-2">
              <option>This Week</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
           </select>
          <Button variant="outline"><Activity size={16} className="mr-2"/> Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Revenue" 
          value={`$${data?.kpi.revenue.toLocaleString()}`} 
          trend={12.5} 
          icon={DollarSign} 
          color="gray" 
        />
        <KPICard 
          title="Avg. Order Value (AOV)" 
          value={`$${data?.kpi.aov}`} 
          trend={2.1} 
          icon={ShoppingBag} 
          color="blue" 
        />
        <KPICard 
          title="Conversion Rate" 
          value={`${data?.kpi.conversion}%`} 
          trend={0.8} 
          icon={MousePointerClick} 
          color="purple" 
        />
        <KPICard 
          title="Acquisition Cost (CAC)" 
          value={`$${data?.kpi.cac}`} 
          trend={-5.4} 
          icon={UserPlus} 
          color="green" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2 p-6 border-gray-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue & Orders</h3>
            <p className="text-sm text-gray-500">Financial performance over time</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111827" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#111827" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="visits" stroke="#111827" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="orders" stroke="#6B7280" strokeWidth={2} fillOpacity={1} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Conversion Funnel / Bar Chart */}
        <Card className="col-span-1 p-6 border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Conversion Rate (%)</h3>
          <p className="text-sm text-gray-500 mb-6">Daily user to customer conversion</p>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#F9FAFB'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6' }}
                />
                <Bar dataKey="rate" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="p-0 overflow-hidden border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
               <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                  {data?.topProducts.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-mono text-sm">0{i+1}</span>
                          <span className="font-medium text-gray-900">{p.name}</span>
                       </div>
                       <span className="text-sm font-semibold">{p.sales} sales</span>
                    </div>
                  ))}
                  {/* Mock extra rows */}
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-mono text-sm">04</span>
                        <span className="font-medium text-gray-900">Cotton Basics</span>
                      </div>
                      <span className="text-sm font-semibold">54 sales</span>
                  </div>
                </div>
            </div>
         </Card>

         <Card className="p-0 overflow-hidden border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-gray-50">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">#ORD-{1000 + i}</td>
                      <td className="px-6 py-4 text-gray-500">Alex B.</td>
                      <td className="px-6 py-4 text-right font-medium">$120.50</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <Button variant="link" size="sm">View All Orders</Button>
            </div>
         </Card>
      </div>
    </div>
  );
}
