import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Phone, MapPin, Calendar, DollarSign, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useBusiness } from '../../hooks/useBusiness';
import { EmployeeProfile } from './EmployeeProfile';

interface Employee {
  id: string;
  business_id: string;
  branch_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  salary: number;
  hire_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  branch?: {
    name: string;
  };
}

interface Branch {
  id: string;
  name: string;
}

interface EmployeeListProps {
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
}

export function EmployeeList({ onAddEmployee, onEditEmployee }: EmployeeListProps) {
  const { business } = useBusiness();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  if (selectedEmployee) {
    return (
      <EmployeeProfile
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  useEffect(() => {
    if (business) {
      fetchEmployees();
      fetchBranches();
    }
  }, [business]);

  const fetchBranches = async () => {
    if (!business) return;

    const { data } = await supabase
      .from('branches')
      .select('id, name')
      .eq('business_id', business.id)
      .eq('is_active', true);

    setBranches(data || []);
  };

  const fetchEmployees = async () => {
    if (!business) return;

    try {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          branch:branches(name)
        `)
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employees:', error);
      } else {
        setEmployees(data || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: false })
        .eq('id', employeeId);

      if (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      } else {
        setEmployees(employees.filter(employee => employee.id !== employeeId));
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const roles = [...new Set(employees.map(e => e.role))];

  const filteredEmployees = employees.filter(employee => {
    const matchesBranch = !selectedBranch || employee.branch_id === selectedBranch;
    const matchesRole = !selectedRole || employee.role === selectedRole;
    return matchesBranch && matchesRole;
  });

  const totalSalary = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>{employees.length} Employees</span>
            <span>₹{totalSalary.toLocaleString()} Total Salary</span>
          </div>
        </div>
        <button
          onClick={onAddEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {employees.length === 0 ? 'No employees yet' : 'No employees match your filters'}
          </h3>
          <p className="text-gray-500 mb-4">
            {employees.length === 0 ? 'Add your first employee to get started' : 'Try adjusting your filters'}
          </p>
          {employees.length === 0 && (
            <button
              onClick={onAddEmployee}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{employee.role}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedEmployee(employee)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditEmployee(employee)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Employee"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Employee"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {employee.email && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                )}

                {employee.phone && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{employee.phone}</span>
                  </div>
                )}

                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{employee.branch?.name || 'All Branches'}</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">₹{employee.salary.toLocaleString()}/month</span>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Joined: {new Date(employee.hire_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Added: {new Date(employee.created_at).toLocaleDateString()}
                  </span>
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