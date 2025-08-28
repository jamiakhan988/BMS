import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, Package, Users, Building2, FileText, BarChart3 } from 'lucide-react';

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Mock data for demonstration
  const summary = {
    totalSales: 2450000,
    totalTransactions: 1250,
    averageOrderValue: 1960,
    topSellingDay: '2024-02-15',
    growth: 15.8
  };

  const salesData = [
    { date: '2024-02-10', total: 45000, count: 25 },
    { date: '2024-02-11', total: 52000, count: 28 },
    { date: '2024-02-12', total: 38000, count: 22 },
    { date: '2024-02-13', total: 61000, count: 35 },
    { date: '2024-02-14', total: 48000, count: 26 },
    { date: '2024-02-15', total: 75000, count: 42 },
    { date: '2024-02-16', total: 55000, count: 31 },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', quantity: 45, revenue: 6070550 },
    { name: 'Laptop Dell XPS 13', quantity: 32, revenue: 2720000 },
    { name: 'Samsung Galaxy S24', quantity: 28, revenue: 2239972 },
    { name: 'MacBook Air M2', quantity: 18, revenue: 2068200 },
    { name: 'iPad Pro 12.9"', quantity: 22, revenue: 2483800 },
  ];

  const branchPerformance = [
    { name: 'Main Branch', sales: 1450000, transactions: 750 },
    { name: 'Downtown Branch', sales: 1000000, transactions: 500 },
  ];

  const employeePerformance = [
    { name: 'John Smith', sales: 450000, transactions: 125 },
    { name: 'Sarah Johnson', sales: 380000, transactions: 98 },
    { name: 'Emily Davis', sales: 320000, transactions: 85 },
    { name: 'Mike Wilson', sales: 280000, transactions: 72 },
  ];

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

  const exportPDFReport = () => {
    // In a real app, this would generate a PDF
    alert('PDF report generation would be implemented here');
  };

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
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportPDFReport}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Export PDF</span>
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
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">
                  {summary.growth.toFixed(1)}%
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
              <p className="text-3xl font-bold text-gray-900">{summary.totalTransactions.toLocaleString()}</p>
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
              <p className="text-3xl font-bold text-gray-900">₹{summary.averageOrderValue.toLocaleString()}</p>
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
                {new Date(summary.topSellingDay).toLocaleDateString()}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Sales Trend (Last 7 Days)
          </h3>
          <div className="space-y-3">
            {salesData.map((day, index) => (
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
            {topProducts.map((product, index) => (
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

      {/* Detailed Analytics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Revenue Growth</h4>
            <p className="text-3xl font-bold text-blue-600">+{summary.growth.toFixed(1)}%</p>
            <p className="text-sm text-blue-700">vs last period</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Customer Satisfaction</h4>
            <p className="text-3xl font-bold text-green-600">4.8/5</p>
            <p className="text-sm text-green-700">average rating</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Inventory Turnover</h4>
            <p className="text-3xl font-bold text-purple-600">8.2x</p>
            <p className="text-sm text-purple-700">times per year</p>
          </div>
        </div>
      </div>
    </div>
  );
}