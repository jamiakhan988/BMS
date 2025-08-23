import React, { useState, useEffect } from 'react';
import { DollarSign, Package, Users, Building2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';

interface DashboardStats {
  totalSales: number;
  totalProducts: number;
  totalEmployees: number;
  totalBranches: number;
  todaySales: number;
  weekSales: number;
  monthSales: number;
}

export function DashboardOverview() {
  const { business } = useBusiness();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProducts: 0,
    totalEmployees: 0,
    totalBranches: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (business) {
      fetchStats();
    }
  }, [business]);

  const fetchStats = async () => {
    if (!business) return;

    try {
      // Get current date boundaries
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(today.setDate(today.getDate() - 7));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch all stats in parallel
      const [
        salesResult,
        todaySalesResult,
        weekSalesResult,
        monthSalesResult,
        productsResult,
        employeesResult,
        branchesResult,
      ] = await Promise.all([
        supabase
          .from('sales')
          .select('total_amount')
          .eq('business_id', business.id),
        supabase
          .from('sales')
          .select('total_amount')
          .eq('business_id', business.id)
          .gte('sale_date', startOfDay.toISOString()),
        supabase
          .from('sales')
          .select('total_amount')
          .eq('business_id', business.id)
          .gte('sale_date', startOfWeek.toISOString()),
        supabase
          .from('sales')
          .select('total_amount')
          .eq('business_id', business.id)
          .gte('sale_date', startOfMonth.toISOString()),
        supabase
          .from('products')
          .select('id')
          .eq('business_id', business.id)
          .eq('is_active', true),
        supabase
          .from('employees')
          .select('id')
          .eq('business_id', business.id)
          .eq('is_active', true),
        supabase
          .from('branches')
          .select('id')
          .eq('business_id', business.id)
          .eq('is_active', true),
      ]);

      const totalSales = salesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const todaySales = todaySalesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const weekSales = weekSalesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const monthSales = monthSalesResult.data?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

      setStats({
        totalSales,
        totalProducts: productsResult.data?.length || 0,
        totalEmployees: employeesResult.data?.length || 0,
        totalBranches: branchesResult.data?.length || 0,
        todaySales,
        weekSales,
        monthSales,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Employees"
          value={stats.totalEmployees}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Branches"
          value={stats.totalBranches}
          icon={Building2}
          color="yellow"
        />
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Sales</h3>
          <p className="text-3xl font-bold text-green-600">₹{stats.todaySales.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
          <p className="text-3xl font-bold text-blue-600">₹{stats.weekSales.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
          <p className="text-3xl font-bold text-purple-600">₹{stats.monthSales.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center">
            <Building2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Branch</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center">
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Product</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Add Employee</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors duration-200 text-center">
            <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Record Sale</p>
          </button>
        </div>
      </div>
    </div>
  );
}