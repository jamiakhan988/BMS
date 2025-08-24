import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Package, Users, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';

interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  manager_name: string | null;
}

interface BranchStats {
  totalSales: number;
  todaySales: number;
  totalProducts: number;
  totalEmployees: number;
  lowStockProducts: number;
  recentSales: any[];
}

interface BranchDashboardProps {
  branch: Branch;
  onBack: () => void;
}

export function BranchDashboard({ branch, onBack }: BranchDashboardProps) {
  const { business } = useBusiness();
  const [stats, setStats] = useState<BranchStats>({
    totalSales: 0,
    todaySales: 0,
    totalProducts: 0,
    totalEmployees: 0,
    lowStockProducts: 0,
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (business && branch) {
      fetchBranchStats();
    }
  }, [business, branch]);

  const fetchBranchStats = async () => {
    if (!business) return;

    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));

      // Fetch all stats in parallel
      const [
        salesResult,
        todaySalesResult,
        productsResult,
        employeesResult,
        lowStockResult,
        recentSalesResult,
      ] = await Promise.all([
        supabase
          .from('sales')
          .select('total_amount')
          .eq('business_id', business.id)
          .eq('branch_id', branch.id),
        supabase
          .from('sales')
          .select('total_amount')
          .eq('business_id', business.id)
          .eq('branch_id', branch.id)
          .gte('sale_date', startOfDay.toISOString()),
        supabase
          .from('products')
          .select('id')
          .eq('business_id', business.id)
          .eq('branch_id', branch.id)
          .eq('is_active', true),
        supabase
          .from('employees')
          .select('id')
          .eq('business_id', business.id)
          .eq('branch_id', branch.id)
          .eq('is_active', true),
        supabase
          .from('products')
          .select('id, name, stock_quantity, min_stock_level')
          .eq('business_id', business.id)
          .eq('branch_id', branch.id)
          .eq('is_active', true)
          .lte('stock_quantity', supabase.raw('min_stock_level')),
        supabase
          .from('sales')
          .select(`
            id,
            total_amount,
            customer_name,
            payment_method,
            sale_date,
            employees(name)
          `)
          .eq('business_id', business.id)
          .eq('branch_id', branch.id)
          .order('sale_date', { ascending: false })
          .limit(10),
      ]);

      const totalSales = salesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const todaySales = todaySalesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

      setStats({
        totalSales,
        todaySales,
        totalProducts: productsResult.data?.length || 0,
        totalEmployees: employeesResult.data?.length || 0,
        lowStockProducts: lowStockResult.data?.length || 0,
        recentSales: recentSalesResult.data || [],
      });
    } catch (error) {
      console.error('Error fetching branch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{branch.name} Dashboard</h1>
            <p className="text-gray-600">{branch.address}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.todaySales.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              {stats.lowStockProducts > 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  {stats.lowStockProducts} low stock
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
        {stats.recentSales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No sales recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customer_name || 'Walk-in Customer'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.employees?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{sale.total_amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}