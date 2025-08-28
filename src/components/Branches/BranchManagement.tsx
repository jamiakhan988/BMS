import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, User, BarChart3, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { BranchForm } from './BranchForm';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager_name: string;
  created_at: string;
  stats: {
    totalSales: number;
    todaySales: number;
    products: number;
    employees: number;
  };
}

export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'Main Branch',
      address: '123 Business Street, City Center',
      phone: '+1 234 567 8900',
      manager_name: 'John Smith',
      created_at: '2024-01-15',
      stats: {
        totalSales: 125000,
        todaySales: 3500,
        products: 45,
        employees: 8
      }
    },
    {
      id: '2',
      name: 'Downtown Branch',
      address: '456 Commerce Ave, Downtown',
      phone: '+1 234 567 8901',
      manager_name: 'Sarah Johnson',
      created_at: '2024-02-20',
      stats: {
        totalSales: 98000,
        todaySales: 2800,
        products: 38,
        employees: 6
      }
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleAddBranch = () => {
    setEditingBranch(null);
    setShowForm(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  const handleDeleteBranch = (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      setBranches(branches.filter(b => b.id !== branchId));
    }
  };

  const handleSaveBranch = (branchData: any) => {
    if (editingBranch) {
      setBranches(branches.map(b => 
        b.id === editingBranch.id 
          ? { ...b, ...branchData }
          : b
      ));
    } else {
      const newBranch: Branch = {
        id: Date.now().toString(),
        ...branchData,
        created_at: new Date().toISOString(),
        stats: {
          totalSales: 0,
          todaySales: 0,
          products: 0,
          employees: 0
        }
      };
      setBranches([...branches, newBranch]);
    }
    setShowForm(false);
  };

  if (selectedBranch) {
    return (
      <BranchDashboard 
        branch={selectedBranch} 
        onBack={() => setSelectedBranch(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branch Management</h2>
          <p className="text-gray-600">Manage your business locations and track performance</p>
        </div>
        <button
          onClick={handleAddBranch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Branches</p>
              <p className="text-3xl font-bold text-gray-900">{branches.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{branches.reduce((sum, b) => sum + b.stats.totalSales, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{branches.reduce((sum, b) => sum + b.stats.todaySales, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">
                {branches.reduce((sum, b) => sum + b.stats.employees, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{branch.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedBranch(branch)}
                  className="text-green-600 hover:text-green-800 p-1"
                  title="View Dashboard"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditBranch(branch)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="Edit Branch"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete Branch"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{branch.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{branch.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Manager: {branch.manager_name}</span>
              </div>
            </div>

            {/* Branch Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">₹{branch.stats.totalSales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Sales</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₹{branch.stats.todaySales.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{branch.stats.products}</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{branch.stats.employees}</p>
                <p className="text-xs text-gray-500">Employees</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created: {new Date(branch.created_at).toLocaleDateString()}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Branch Form Modal */}
      {showForm && (
        <BranchForm
          branch={editingBranch}
          onClose={() => setShowForm(false)}
          onSave={handleSaveBranch}
        />
      )}
    </div>
  );
}

// Branch Dashboard Component
function BranchDashboard({ branch, onBack }: { branch: Branch; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{branch.name} Dashboard</h1>
          <p className="text-gray-600">{branch.address}</p>
        </div>
      </div>

      {/* Advanced Branch Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{branch.stats.totalSales.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-3xl font-bold text-gray-900">₹{branch.stats.todaySales.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-2">15 transactions</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-3xl font-bold text-gray-900">{branch.stats.products}</p>
              <p className="text-sm text-purple-600 mt-2">3 low stock</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-3xl font-bold text-gray-900">{branch.stats.employees}</p>
              <p className="text-sm text-yellow-600 mt-2">All active</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
        <div className="space-y-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const value = Math.random() * 5000 + 1000;
            return (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-12">{day}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(value / 6000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-20 text-right">
                  ₹{value.toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}