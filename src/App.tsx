import { useEffect, useState } from 'react';
import { EnhancedLandingPage } from './components/EnhancedLandingPage';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { EnhancedFacultyPortal } from './components/EnhancedFacultyPortal';
import { EnhancedStudentPortal } from './components/EnhancedStudentPortal';
import { EnhancedTimetableGenerator } from './components/EnhancedTimetableGenerator';
import { AdvancedAnalyticsDashboard } from './components/AdvancedAnalyticsDashboard';
import { CollaborationHub } from './components/CollaborationHub';
import { BenefitsInfo } from './components/BenefitsInfo';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AppProvider, useApp } from './contexts/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export type UserRole = 'admin' | 'faculty' | 'student' | null;
export type CurrentView = 'landing' | 'dashboard' | 'generate' | 'analytics' | 'collaboration' | 'benefits';

function AppContent() {
  const { state, dispatch } = useApp();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize app and restore user session
  useEffect(() => {
    const initializeApp = () => {
      try {
        // Restore user from localStorage
        const savedUser = localStorage.getItem('timelytics_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.role) {
            dispatch({ type: 'SET_USER', payload: user });
            dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
          }
        }

        // Restore dark mode preference
        const savedDarkMode = localStorage.getItem('timelytics_darkMode');
        if (savedDarkMode === 'true') {
          dispatch({ type: 'TOGGLE_DARK_MODE' });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('timelytics_darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('timelytics_darkMode', 'false');
    }
  }, [state.darkMode]);

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Timelytics.ai...</p>
        </div>
      </div>
    );
  }

  const handleLogin = (role: UserRole, userData?: any) => {
    const user = {
      role,
      id: userData?.id || `${role}_${Date.now()}`,
      name: userData?.name || 'User',
      email: userData?.email || '',
      institution: userData?.institution || ''
    };
    
    dispatch({ type: 'SET_USER', payload: user });
    localStorage.setItem('timelytics_user', JSON.stringify(user));
    setShowWelcome(true);
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: { role: null } });
    dispatch({ type: 'SET_VIEW', payload: 'landing' });
    localStorage.removeItem('timelytics_user');
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const navigateToView = (view: CurrentView) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  // Show welcome screen
  if (showWelcome && state.currentUser.role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
        <WelcomeScreen 
          user={state.currentUser}
          onContinue={() => {
            setShowWelcome(false);
            dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
          }}
        />
      </div>
    );
  }

  // Landing page
  if (state.currentView === 'landing' || !state.currentUser.role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
        <EnhancedLandingPage onLogin={handleLogin} />
      </div>
    );
  }

  // Special views
  if (state.currentView === 'generate') {
    return (
      <EnhancedTimetableGenerator 
        userRole={state.currentUser.role} 
        onBack={() => navigateToView('dashboard')}
        onToggleDarkMode={toggleDarkMode}
        darkMode={state.darkMode}
      />
    );
  }

  if (state.currentView === 'analytics') {
    return (
      <AdvancedAnalyticsDashboard 
        onBack={() => navigateToView('dashboard')}
        onToggleDarkMode={toggleDarkMode}
        darkMode={state.darkMode}
      />
    );
  }

  if (state.currentView === 'collaboration') {
    return (
      <CollaborationHub 
        onBack={() => navigateToView('dashboard')}
        onToggleDarkMode={toggleDarkMode}
        darkMode={state.darkMode}
      />
    );
  }

  if (state.currentView === 'benefits') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
        <BenefitsInfo 
          onBack={() => navigateToView('dashboard')}
          onToggleDarkMode={toggleDarkMode}
          darkMode={state.darkMode}
        />
      </div>
    );
  }

  // Role-based dashboards
  const dashboardProps = {
    onNavigate: navigateToView,
    onLogout: handleLogout,
    onToggleDarkMode: toggleDarkMode,
    darkMode: state.darkMode
  };

  switch (state.currentUser.role) {
    case 'admin':
      return <EnhancedAdminDashboard {...dashboardProps} />;
    case 'faculty':
      return <EnhancedFacultyPortal {...dashboardProps} />;
    case 'student':
      return <EnhancedStudentPortal {...dashboardProps} />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-900 dark:to-slate-800">
          <EnhancedLandingPage onLogin={handleLogin} />
        </div>
      );
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}