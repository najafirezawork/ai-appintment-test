import React, { useState, useEffect } from 'react';
import { AppState, User, Appointment, ViewState, Notification, AppointmentStatus, UserRole, Service, Provider } from './types';
import { TRANSLATIONS } from './constants';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import { GlobalLoader } from './components/NovaUI';
import { apiService } from './services/apiService';

export type Language = 'fa' | 'en';

interface GlobalData {
  services: Service[];
  providers: Provider[];
}

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fa');
  const [state, setState] = useState<AppState>({
    user: null,
    currentView: 'AUTH',
    appointments: [],
    notifications: [],
    isLoading: false,
  });
  
  const [globalData, setGlobalData] = useState<GlobalData>({
    services: [],
    providers: [],
  });

  const t = TRANSLATIONS[lang];

  // Update HTML direction based on language
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    if (lang === 'en') {
        document.body.style.fontFamily = "'Inter', sans-serif";
    } else {
        document.body.style.fontFamily = "'Vazirmatn', sans-serif";
    }
  }, [lang]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [services, providers] = await Promise.all([
                apiService.getServices(),
                apiService.getProviders()
            ]);
            setGlobalData({ services, providers });
        } catch (error) {
            console.error("Failed to load initial data", error);
            addNotification("Failed to load application data", "error");
        }
    };
    fetchData();
  }, []);

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const handleLogin = async (role: UserRole) => {
    setLoading(true);
    try {
        const user = await apiService.login(role);
        const appointments = await apiService.getAppointments(user.id);
        
        setState(prev => ({ 
            ...prev, 
            user: user, 
            appointments: appointments,
            currentView: 'DASHBOARD',
            isLoading: false 
        }));
        addNotification(`${t.welcome} ${user.name}`, 'success');
    } catch (error) {
        setLoading(false);
        addNotification("Login failed", "error");
    }
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, user: null, currentView: 'AUTH', appointments: [] }));
  };

  const navigate = (view: ViewState) => {
    setState(prev => ({ ...prev, currentView: view }));
  };

  const handleBookingComplete = async (apt: Appointment) => {
    setLoading(true);
    try {
        const newAppointment = await apiService.createAppointment(apt);
        setState(prev => ({
            ...prev,
            appointments: [...prev.appointments, newAppointment],
            currentView: 'DASHBOARD',
            isLoading: false
        }));
        addNotification(t.status_confirmed, 'success');
    } catch (error) {
        setLoading(false);
        addNotification("Booking failed", "error");
    }
  };

  const cancelAppointment = async (id: string) => {
    setLoading(true);
    try {
        await apiService.cancelAppointment(id);
        setState(prev => ({
            ...prev,
            appointments: prev.appointments.map(a => 
                a.id === id ? { ...a, status: AppointmentStatus.CANCELLED } : a
            ),
            isLoading: false
        }));
        addNotification(t.status_cancelled, 'info');
    } catch (error) {
        setLoading(false);
        addNotification("Cancellation failed", "error");
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setLoading(true);
    try {
        const user = await apiService.updateUser(updatedUser);
        setState(prev => ({
            ...prev,
            user: user,
            isLoading: false
        }));
        addNotification(t.save_changes, 'success');
    } catch (error) {
        setLoading(false);
        addNotification("Update failed", "error");
    }
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
        
        {state.currentView === 'DASHBOARD' && state.user && (
          <Dashboard 
            user={state.user}
            appointments={state.appointments} 
            services={globalData.services}
            providers={globalData.providers}
            onNewBooking={() => navigate('BOOKING')}
            onCancel={cancelAppointment}
            lang={lang}
            setLoading={setLoading}
          />
        )}
        
        {state.currentView === 'BOOKING' && state.user && (
          <Booking 
            user={state.user}
            services={globalData.services}
            providers={globalData.providers}
            onBookingComplete={handleBookingComplete}
            onCancel={() => navigate('DASHBOARD')}
          />
        )}
        
        {state.currentView === 'PROFILE' && state.user && (
          <Profile 
            user={state.user}
            providers={globalData.providers}
            onUpdateUser={handleUpdateUser} 
            lang={lang} 
          />
        )}
      </Layout>
    </div>
  );
};

export default App;