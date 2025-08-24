import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Phone, User, BarChart3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';
import { BranchDashboard } from './BranchDashboard';

interface Branch {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  phone: string | null;
  manager_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BranchListProps {
  onAddBranch: () => void;
  onEditBranch: (branch: Branch) => void;
}

export function BranchList({ onAddBranch, onEditBranch }: BranchListProps) {
  const { business } = useBusiness();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  if (selectedBranch) {
    return (
      <BranchDashboard
        branch={selectedBranch}
        onBack={() => setSelectedBranch(null)}
      />
    );
  }

  useEffect(() => {
    if (business) {
      fetchBranches();
    }
  }, [business]);

  const fetchBranches = async () => {
    if (!business) return;

    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching branches:', error);
      } else {
        setBranches(data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('branches')
        .update({ is_active: false })
        .eq('id', branchId);

      if (error) {
        console.error('Error deleting branch:', error);
        alert('Failed to delete branch');
      } else {
        setBranches(branches.filter(branch => branch.id !== branchId));
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete branch');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Branches</h2>
        <button
          onClick={onAddBranch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Branch</span>
        </button>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No branches yet</h3>
          <p className="text-gray-500 mb-4">Create your first branch to get started</p>
          <button
            onClick={onAddBranch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Branch</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                    onClick={() => onEditBranch(branch)}
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

              <div className="space-y-3">
                {branch.address && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{branch.address}</span>
                  </div>
                )}

                {branch.phone && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{branch.phone}</span>
                  </div>
                )}

                {branch.manager_name && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Manager: {branch.manager_name}</span>
                  </div>
                )}
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
      )}
    </div>
  );
}