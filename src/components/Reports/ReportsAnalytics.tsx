import React, { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Package, Users, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';

interface SalesData {
  date: string;
  total: number;
  count: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

interface BranchPerformance {
  name: string;
  sales: number;
  transactions: number;
}

interface EmployeePerformance {
  name: string;
  sales: number;
  transactions: number;
}

export function ReportsAnalytics() {
  const { business } = useBusiness();
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [branchPerformance, setBranchPerformance] = useState<BranchPerformance[]>([]);
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
    topSellingDay: '',
    growth: 0
  });

  useEffect(() => {
    if (business) {
      fetchReportsData();
    }
  }, [business, dateRange]);

  const fetchReportsData = async () => {
    if (!business) return;

    setLoading(true);

    try {
      // Fetch sales data
      const { data: salesResult } = await supabase
        .from('sales')
        .select(`
          total_amount,
          sale_date,
          branch_id,
          employee_id,
          branches(name),
          employees(name)
        `)
        .eq('business_id', business.id)
        .gte('sale_date', dateRange.start)
        .lte('sale_date', dateRange.end + 'T23:59:59')
        .order('sale_date');

      // Fetch sale items for product analysis
      const { data: saleItemsResult } = await supabase
        .from('sale_items')
        .select(`
          quantity,
          total_price,
          products(name),
          sales!inner(
            business_id,
            sale_date
          )
        `)
        .eq('sales.business_id', business.id)
        .gte('sales.sale_date', dateRange.start)
        .lte('sales.sale_date', dateRange.end + 'T23:59:59');

      // Process sales data by date
      const salesByDate: { [key: string]: { total: number; count: number } } = {};
      let totalSales = 0;
      let totalTransactions = 0;

      salesResult?.forEach(sale => {
        const date = new Date(sale.sale_date).toISOString().split('T')[0];
        if (!salesByDate[date]) {
          salesByDate[date] = { total: 0, count: 0 };
        }
        salesByDate[date].total += sale.total_amount;
        salesByDate[date].count += 1;
        totalSales += sale.total_amount;
        totalTransactions += 1;
      });

      const salesDataArray = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        total: data.total,
        count: data.count
      }));

      setSalesData(salesDataArray);

      // Process top products
      const productSales: { [key: string]: { quantity: number; revenue: number } } = {};
      saleItemsResult?.forEach(item => {
        const productName = item.products?.name || 'Unknown Product';
        if (!productSales[productName]) {
          productSales[productName] = { quantity: 0, revenue: 0 };
        }
        productSales[productName].quantity += item.quantity;
        productSales[productName].revenue += item.total_price;
      });

      const topProductsArray = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setTopProducts(topProductsArray);

      // Process branch performance
      const branchSales: { [key: string]: { sales: number; transactions: number } } = {};
      salesResult?.forEach(sale => {
        const branchName = sale.branches?.name || 'Unknown Branch';
        if (!branchSales[branchName]) {
          branchSales[branchName] = { sales: 0, transactions: 0 };
        }
        branchSales[branchName].sales += sale.total_amount;
        branchSales[branchName].transactions += 1;
      });

      const branchPerformanceArray = Object.entries(branchSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.sales - a.sales);

      setBranchPerformance(branchPerformanceArray);

      // Process employee performance
      const employeeSales: { [key: string]: { sales: number; transactions: number } } = {};
      salesResult?.forEach(sale => {
        if (sale.employees?.name) {
          const employeeName = sale.employees.name;
          if (!employeeSales[employeeName]) {
            employeeSales[employeeName] = { sales: 0, transactions: 0 };
          }
          employeeSales[employeeName].sales += sale.total_amount;
          employeeSales[employeeName].transactions += 1;
        }
      });

      const employeePerformanceArray = Object.entries(employeeSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);

      setEmployeePerformance(employeePerformanceArray);

      // Calculate summary
      const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
      const topSellingDay = salesDataArray.reduce((max, day) => 
        day.total > max.total ? day : max, 
        { date: '', total: 0 }
      ).date;

      // Calculate growth (compare with previous period)
      const periodDays = Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (1000 * 60 * 60 * 24));
      const previousStart = new Date(new Date(dateRange.start).getTime() - periodDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const previousEnd = new Date(new Date(dateRange.start).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: previousSales } = await supabase
        .from('sales')
        .select('total_amount')
        .eq('business_id', business.id)
        .gte('sale_date', previousStart)
        .lte('sale_date', previousEnd + 'T23:59:59');

      const previousTotal = previousSales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const growth = previousTotal > 0 ? ((totalSales - previousTotal) / previousTotal) * 100 : 0;

      setSummary({
        totalSales,
        totalTransactions,
        averageOrderValue,
        topSellingDay,
        growth
      });

    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const reportData = {
      period: `${dateRange.start} to ${dateRange.end}`,
      summary,
      salesData,
      topProducts,
      branchPerformance,
      employeePerformance
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-${dateRange.start}-to-${dateRange.end}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button
            onClick={exportReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900">₹{summary.totalSales.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {summary.growth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${summary.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(summary.growth).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-3xl font-bold text-gray-900">{summary.totalTransactions}</p>
              <p className="text-sm text-gray-500 mt-2">Total orders</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-3xl font-bold text-gray-900">₹{summary.averageOrderValue.toFixed(0)}</p>
              <p className="text-sm text-gray-500 mt-2">Per transaction</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Selling Day</p>
              <p className="text-lg font-bold text-gray-900">
                {summary.topSellingDay ? new Date(summary.topSellingDay).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Best performance</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="space-y-3">
            {salesData.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (day.total / Math.max(...salesData.map(d => d.total))) * 100)}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    ₹{day.total.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 truncate max-w-32">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{product.quantity} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch and Employee Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Performance</h3>
          <div className="space-y-4">
            {branchPerformance.map((branch, index) => (
              <div key={branch.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{branch.name}</p>
                    <p className="text-sm text-gray-500">{branch.transactions} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{branch.sales.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    ₹{(branch.sales / branch.transactions).toFixed(0)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-4">
            {employeePerformance.map((employee, index) => (
              <div key={employee.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.transactions} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{employee.sales.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    ₹{(employee.sales / employee.transactions).toFixed(0)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}