import React, { ReactNode } from 'react';
import { User, ViewState } from '../types';
import { TRANSLATIONS } from '../constants';
import { Language } from '../App';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate, onLogout, lang, setLang }) => {
  const t = TRANSLATIONS[lang];

  if (!user) {
    // Only show lang switcher on Auth page top right
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50 flex gap-2">
             <button onClick={() => setLang('fa')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'fa' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600'}`}>فا</button>
             <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600'}`}>EN</button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-gray-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-black text-primary flex items-center gap-2">
          <i className="fas fa-heart-pulse"></i> {t.app_name}
        </h1>
        <div className="flex gap-3 items-center">
            <button onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                {lang === 'fa' ? 'EN' : 'فا'}
            </button>
            <img src={user.avatarUrl} className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white h-screen sticky top-0 shadow-2xl shadow-gray-200/50 z-20">
        <div className="p-8">
           <h1 className="text-2xl font-black text-primary flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                <i className="fas fa-heart-pulse"></i>
            </div>
            {t.app_name}
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon="fa-grid-2" 
            label={t.dashboard} 
            active={currentView === 'DASHBOARD'} 
            onClick={() => onNavigate('DASHBOARD')} 
          />
          {user.role === 'PATIENT' && (
              <NavItem 
                icon="fa-plus-circle" 
                label={t.book_new} 
                active={currentView === 'BOOKING'} 
                onClick={() => onNavigate('BOOKING')} 
              />
          )}
          <NavItem 
            icon="fa-user-circle" 
            label={t.profile} 
            active={currentView === 'PROFILE'} 
            onClick={() => onNavigate('PROFILE')} 
          />
        </nav>

        <div className="p-6 mt-auto">
          {/* Language Switcher */}
          <div className="bg-gray-50 rounded-xl p-1 flex mb-6">
             <button onClick={() => setLang('fa')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'fa' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>فارسی</button>
             <button onClick={() => setLang('en')} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}>English</button>
          </div>

          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3 group"
          >
            <i className="fas fa-sign-out-alt group-hover:-translate-x-1 transition-transform rtl:group-hover:translate-x-1"></i> {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen p-4 md:p-10 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 flex justify-around p-3 z-30 pb-safe">
         <button onClick={() => onNavigate('DASHBOARD')} className={`flex flex-col items-center w-16 ${currentView === 'DASHBOARD' ? 'text-primary' : 'text-gray-400'}`}>
           <i className="fas fa-grid-2 text-xl mb-1"></i>
           <span className="text-[10px] font-bold">{t.dashboard}</span>
         </button>
         {user.role === 'PATIENT' && (
            <button onClick={() => onNavigate('BOOKING')} className={`flex flex-col items-center w-16 -mt-8`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30 ${currentView === 'BOOKING' ? 'bg-primary text-white' : 'bg-gray-800 text-white'}`}>
                <i className="fas fa-plus text-2xl"></i>
            </div>
            </button>
         )}
         <button onClick={() => onNavigate('PROFILE')} className={`flex flex-col items-center w-16 ${currentView === 'PROFILE' ? 'text-primary' : 'text-gray-400'}`}>
           <i className="fas fa-user text-xl mb-1"></i>
           <span className="text-[10px] font-bold">{t.profile}</span>
         </button>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: string, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/30 translate-x-1 rtl:-translate-x-1' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <i className={`fas ${icon} w-5 text-center`}></i>
    {label}
  </button>
);

export default Layout;