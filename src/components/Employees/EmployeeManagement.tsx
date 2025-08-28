import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Phone, MapPin, Calendar, DollarSign, Eye, Award } from 'lucide-react';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeProfile } from './EmployeeProfile';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  salary: number;
  hire_date: string;
  branch: string;
  department: string;
  performance_rating: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 234 567 8900',
      role: 'Store Manager',
      salary: 45000,
      hire_date: '2023-01-15',
      branch: 'Main Branch',
      department: 'Management',
      performance_rating: 4.5,
      status: 'active',
      created_at: '2023-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 234 567 8901',
      role: 'Sales Associate',
      salary: 28000,
      hire_date: '2023-03-20',
      branch: 'Downtown Branch',
      department: 'Sales',
      performance_rating: 4.2,
      status: 'active',
      created_at: '2023-03-20'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+1 234 567 8902',
      role: 'Cashier',
      salary: 25000,
      hire_date: '2023-06-10',
      branch: 'Main Branch',
      department: 'Operations',
      performance_rating: 3.8,
      status: 'active',
      created_at: '2023-06-10'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      phone: '+1 234 567 8903',
      role: 'Inventory Manager',
      salary: 38000,
      hire_date: '2023-02-28',
      branch: 'Downtown Branch',
      department: 'Operations',
      performance_rating: 4.7,
      status: 'active',
      created_at: '2023-02-28'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@company.com',
      phone: '+1 234 567 8904',
      role: 'Security Guard',
      salary: 22000,
      hire_date: '2023-08-15',
      branch: 'Main Branch',
      department: 'Security',
      performance_rating: 4.0,
      status: 'active',
      created_at: '2023-08-15'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const branches = [...new Set(employees.map(e => e.branch))];
  const departments = [...new Set(employees.map(e => e.department))];
  const roles = [...new Set(employees.map(e => e.role))];

  const filteredEmployees = employees.filter(employee => {
    const matchesBranch = !selectedBranch || employee.branch === selectedBranch;
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    const matchesRole = !selectedRole || employee.role === selectedRole;
    return matchesBranch && matchesDepartment && matchesRole;
  });

  const totalSalary = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgPerformance = filteredEmployees.reduce((sum, emp) => sum + emp.performance_rating, 0) / filteredEmployees.length;

  if (selectedEmployee) {
    return (
      <EmployeeProfile
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== employeeId));
    }
  };

  const handleSaveEmployee = (employeeData: any) => {
    if (editingEmployee) {
      setEmployees(employees.map(e => 
        e.id === editingEmployee.id 
          ? { ...e, ...employeeData }
          : e
      ));
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...employeeData,
        performance_rating: 0,
        status: 'active' as const,
        created_at: new Date().toISOString(),
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>{employees.length} Employees</span>
            <span>₹{totalSalary.toLocaleString()} Total Salary</span>
            <span>{avgPerformance.toFixed(1)} Avg Rating</span>
          </div>
        </div>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
              <p className="text-3xl font-bold text-gray-900">₹{totalSalary.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-3xl font-bold text-gray-900">{avgPerformance.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
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

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
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
                  onClick={() => handleEditEmployee(employee)}
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
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{employee.email}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{employee.phone}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{employee.branch}</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">₹{employee.salary.toLocaleString()}/month</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Joined: {new Date(employee.hire_date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Award className="h-4 w-4 text-gray-400" />
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= employee.performance_rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {employee.performance_rating}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {employee.department}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => setShowForm(false)}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  );
}