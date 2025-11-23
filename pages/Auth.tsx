import React, { useState } from 'react';
import Button from '../components/Button';
import { TRANSLATIONS } from '../constants';
import { UserRole } from '../types';
import { Language } from '../App';

interface AuthProps {
  onLogin: (role: UserRole) => void;
  lang: Language;
}

const Auth: React.FC<AuthProps> = ({ onLogin, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.PATIENT);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin(selectedRole);
    }, 8000); // Intentionally long to show loading state
    setTimeout(() => {
        setLoading(false);
        onLogin(selectedRole);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-white/50">
        <div className="p-8 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-primary/30 transform rotate-3">
              <i className="fas fa-heart-pulse"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{t.app_name}</h2>
            <p className="text-gray-500 mt-2 font-medium">
               {isLogin ? t.welcome_sub : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
               <button
                 type="button"
                 onClick={() => setSelectedRole(UserRole.PATIENT)}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                   selectedRole === UserRole.PATIENT 
                   ? 'bg-white text-primary shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 {t.role_patient}
               </button>
               <button
                 type="button"
                 onClick={() => setSelectedRole(UserRole.PROVIDER)}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                   selectedRole === UserRole.PROVIDER 
                   ? 'bg-white text-primary shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 {t.role_provider}
               </button>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{t.name}</label>
                <div className="relative group">
                  <i className={`fas fa-user absolute top-3.5 text-gray-400 group-focus-within:text-primary transition-colors ${lang === 'fa' ? 'right-4' : 'left-4'}`}></i>
                  <input type="text" className={`w-full py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${lang === 'fa' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="Name..." required />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{t.email}</label>
              <div className="relative group">
                <i className={`fas fa-envelope absolute top-3.5 text-gray-400 group-focus-within:text-primary transition-colors ${lang === 'fa' ? 'right-4' : 'left-4'}`}></i>
                <input type="email" className={`w-full py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${lang === 'fa' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="user@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">{t.password}</label>
              <div className="relative group">
                <i className={`fas fa-lock absolute top-3.5 text-gray-400 group-focus-within:text-primary transition-colors ${lang === 'fa' ? 'right-4' : 'left-4'}`}></i>
                <input type="password" className={`w-full py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${lang === 'fa' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`} placeholder="••••••••" required />
              </div>
            </div>

            <Button type="submit" className="w-full py-3.5 text-lg shadow-lg shadow-primary/30 mt-4" isLoading={loading}>
              {isLogin ? t.login_btn : t.register_btn}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500">{isLogin ? "New here?" : "Already have an account?"}</span>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className={`mx-2 text-primary font-bold hover:underline`}
            >
              {isLogin ? t.register_btn : t.login_btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;