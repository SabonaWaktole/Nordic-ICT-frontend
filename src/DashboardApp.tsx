import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import News from './components/News';
import Partners from './components/Partners';
import Profile from './components/Profile';

const DashboardContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'news':
        return <News />;
      case 'partners':
        return <Partners />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  );
};

const DashboardApp: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <ActivityProvider>
          <DashboardContent />
        </ActivityProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default DashboardApp;
