import React, { useState, useEffect } from 'react';
import { AppState, User, Appointment, ViewState, Notification, AppointmentStatus, UserRole } from './types';
import { MOCK_USER_PATIENT, MOCK_USER_PROVIDER, INITIAL_APPOINTMENTS, TRANSLATIONS } from './constants';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import { GlobalLoader } from './components/NovaUI';

export type Language = 'fa' | 'en';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [state, setState] = useState<AppState>({
    user: null,
    currentView: 'AUTH',
    appointments: INITIAL_APPOINTMENTS,
    notifications: [],
    isLoading: false,
  });

  const t = TRANSLATIONS[lang];

  // Update HTML direction based on language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    // Update font based on lang
    if (lang === 'en') {
        document.body.style.fontFamily = "'Inter', sans-serif";
    } else {
        document.body.style.fontFamily = "'Vazirmatn', sans-serif";
    }
  }, [lang]);

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const handleLogin = (role: UserRole) => {
    setLoading(true);
    // Simulate API call delay for login
    setTimeout(() => {
      const user = role === UserRole.PATIENT ? MOCK_USER_PATIENT : MOCK_USER_PROVIDER;
      setState(prev => ({ 
        ...prev, 
        user: user, 
        currentView: 'DASHBOARD',
        isLoading: false 
      }));
      addNotification(`${t.welcome} ${user.name}`, 'success');
    }, 1500);
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null, currentView: 'AUTH' }));
  };

  const navigate = (view: ViewState) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const addAppointment = (apt: Appointment) => {
    setLoading(true);
    // Simulate API call delay for booking
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        appointments: [...prev.appointments, apt],
        currentView: 'DASHBOARD',
        isLoading: false
      }));
      addNotification(t.status_confirmed, 'success');
    }, 1500);
  };

  const cancelAppointment = (id: string) => {
    // Simulate short delay for cancellation
    setLoading(true);
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => 
          a.id === id ? { ...a, status: AppointmentStatus.CANCELLED } : a
        ),
        isLoading: false
      }));
      addNotification(t.status_cancelled, 'info');
    }, 800);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setLoading(true);
    setTimeout(() => {
        setState(prev => ({
            ...prev,
            user: updatedUser,
            isLoading: false
        }));
        addNotification(t.save_changes, 'success');
    }, 1000);
  };

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { id, message, type }]
    }));
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== id)
      }));
    }, 3000);
  };

  return (
    <div className="relative">
      {state.isLoading && <GlobalLoader />}

      {/* Global Notification Toast */}
      <div className={`fixed top-4 ${lang === 'fa' ? 'left-4' : 'right-4'} z-50 flex flex-col gap-2 pointer-events-none`}>
        {state.notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-bounce-in flex items-center gap-2 ${
              n.type === 'success' ? 'bg-emerald-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
             <i className={`fas ${n.type === 'success' ? 'fa-check-circle' : n.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
             {n.message}
          </div>
        ))}
      </div>

      <Layout 
        user={state.user} 
        currentView={state.currentView} 
        onNavigate={navigate}
        onLogout={handleLogout}
        lang={lang}
        setLang={setLang}
      >
        {state.currentView === 'AUTH' && <Auth onLogin={handleLogin} lang={lang} />}
        {state.currentView === 'DASHBOARD' && (
          <Dashboard 
            user={state.user!}
            appointments={state.appointments} 
            onNewBooking={() => navigate('BOOKING')}
            onCancel={cancelAppointment}
            lang={lang}
            setLoading={setLoading}
          />
        )}
        {state.currentView === 'BOOKING' && state.user && (
          <Booking 
            user={state.user}
            onBookingComplete={addAppointment}
            onCancel={() => navigate('DASHBOARD')}
          />
        )}
        {state.currentView === 'PROFILE' && state.user && (
          <Profile 
            user={state.user} 
            onUpdateUser={handleUpdateUser} 
            lang={lang} 
          />
        )}
      </Layout>
    </div>
  );
};

export default App;