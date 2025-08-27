import React from 'react';
import { DollarSign, Package, Users, Building2, TrendingUp, ShoppingCart } from 'lucide-react';

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Business Dashboard!</h2>
        <p className="text-blue-100">Manage your business operations efficiently with our comprehensive tools.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹0</p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Start selling to see revenue
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-blue-600 mt-2">Add your first product</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-purple-600 mt-2">Hire your team</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Branches</p>
              <p className="text-3xl font-bold text-gray-900">1</p>
              <p className="text-sm text-yellow-600 mt-2">Main branch active</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 text-center group">
            <Building2 className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Add Branch</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors duration-200 text-center group">
            <Package className="h-8 w-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">Add Product</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors duration-200 text-center group">
            <Users className="h-8 w-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Add Employee</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors duration-200 text-center group">
            <ShoppingCart className="h-8 w-8 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">Start Selling</p>
          </button>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Set up your branches</h4>
              <p className="text-sm text-gray-600">Add your business locations to organize operations</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600 font-semibold">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Add your products</h4>
              <p className="text-sm text-gray-600">Build your inventory with products and pricing</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-purple-600 font-semibold">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Hire your team</h4>
              <p className="text-sm text-gray-600">Add employees and assign them to branches</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-orange-600 font-semibold">4</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Start selling</h4>
              <p className="text-sm text-gray-600">Use the POS system to process sales and track revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}