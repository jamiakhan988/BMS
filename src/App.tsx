import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/Auth/AuthForm';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { BranchManagement } from './components/Branches/BranchManagement';
import { POSSystem } from './components/POS/POSSystem';
import { InventoryManagement } from './components/Inventory/InventoryManagement';
import { EmployeeManagement } from './components/Employees/EmployeeManagement';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { BusinessSettings } from './components/Settings/BusinessSettings';
import { useAuth } from './hooks/useAuth';
import { useBusiness } from './hooks/useBusiness';
import toast from 'react-hot-toast';

function App() {
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const { business } = useBusiness();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentPage, setCurrentPage] = useState('dashboard');

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
        return <BranchManagement />;
      case 'pos':
        return <POSSystem />;
      case 'inventory':
        return <InventoryManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <BusinessSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  // Show loading only if actually loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not logged in
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

  // Show main app if logged in
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
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;