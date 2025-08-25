import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/Auth/AuthForm';
import { BusinessSetup } from './components/Setup/BusinessSetup';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { BranchList } from './components/Branches/BranchList';
import { BranchForm } from './components/Branches/BranchForm';
import { POSSystem } from './components/POS/POSSystem';
import { InventoryList } from './components/Inventory/InventoryList';
import { ProductForm } from './components/Inventory/ProductForm';
import { EmployeeList } from './components/Employees/EmployeeList';
import { EmployeeForm } from './components/Employees/EmployeeForm';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { BusinessSettings } from './components/Settings/BusinessSettings';
import { useAuth } from './hooks/useAuth';
import { useBusiness } from './hooks/useBusiness';
import toast from 'react-hot-toast';

function App() {
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const { business, loading: businessLoading, needsSetup } = useBusiness();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);

  const handleAuthSubmit = async (data: any) => {
    try {
      if (authMode === 'signup') {
        const { error } = await signUp(
          data.email,
          data.password,
          data.fullName,
          data.businessName
        );
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created successfully! Please sign in.');
          setAuthMode('signin');
        }
      } else {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Welcome back!');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleSetupComplete = () => {
    window.location.reload();
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard';
      case 'branches':
        return 'Branches';
      case 'pos':
        return 'Point of Sale';
      case 'inventory':
        return 'Inventory Management';
      case 'employees':
        return 'Employee Management';
      case 'reports':
        return 'Reports & Analytics';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'branches':
        return (
          <BranchList
            onAddBranch={() => setShowBranchForm(true)}
            onEditBranch={(branch) => {
              setEditingBranch(branch);
              setShowBranchForm(true);
            }}
          />
        );
      case 'pos':
        return <POSSystem />;
      case 'inventory':
        return (
          <InventoryList
            onAddProduct={() => setShowProductForm(true)}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setShowProductForm(true);
            }}
          />
        );
      case 'employees':
        return (
          <EmployeeList
            onAddEmployee={() => setShowEmployeeForm(true)}
            onEditEmployee={(employee) => {
              setEditingEmployee(employee);
              setShowEmployeeForm(true);
            }}
          />
        );
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <BusinessSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  if (authLoading || businessLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm
          mode={authMode}
          onSubmit={handleAuthSubmit}
          loading={authLoading}
          onModeChange={setAuthMode}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  if (needsSetup) {
    return (
      <>
        <BusinessSetup onComplete={handleSetupComplete} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <div className="flex-1 flex flex-col">
          <Header title={getPageTitle()} />
          
          <main className="flex-1 p-6 overflow-auto">
            {renderCurrentPage()}
          </main>
        </div>

        {showBranchForm && (
          <BranchForm
            branch={editingBranch}
            onClose={() => {
              setShowBranchForm(false);
              setEditingBranch(null);
            }}
            onSave={() => {
              setShowBranchForm(false);
              setEditingBranch(null);
            }}
          />
        )}

        {showProductForm && (
          <ProductForm
            product={editingProduct}
            onClose={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
            onSave={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        )}

        {showEmployeeForm && (
          <EmployeeForm
            employee={editingEmployee}
            onClose={() => {
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            }}
            onSave={() => {
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            }}
          />
        )}
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;