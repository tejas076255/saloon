import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './lib/auth/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Keep view synchronized with authentication state and URL hash
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentView('dashboard');
      } else {
        // When not authenticated (or after logout), always return cleanly to landing page
        setCurrentView('landing');
        if (window.location.hash === '#dashboard') {
          window.location.hash = '';
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleEnterDashboard = () => {
    setCurrentView('dashboard');
    window.location.hash = 'dashboard';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'dashboard' && isAuthenticated) {
    return <DashboardPage />;
  }

  return <LandingPage onEnterDashboard={handleEnterDashboard} />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
