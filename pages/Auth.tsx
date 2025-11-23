import React, { useState } from 'react';
import { Card, Input, Button, Text } from '../components/NovaUI';
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
  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <Card variant="glass" className="w-full max-w-md relative z-10 animate-fade-in" noPadding>
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-glow transform rotate-3">
              <i className="fas fa-heart-pulse"></i>
            </div>
            <Text variant="h2" className="mb-2">{t.app_name}</Text>
            <Text variant="body" className="text-gray-500">
               {isLogin ? t.welcome_sub : t.create_account}
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
               <button
                 type="button"
                 onClick={() => setSelectedRole(UserRole.PATIENT)}
                 className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
                   selectedRole === UserRole.PATIENT 
                   ? 'bg-white text-primary-600 shadow-sm' 
                   : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 {t.role_patient}
               </button>
               <button
                 type="button"
                 onClick={() => setSelectedRole(UserRole.PROVIDER)}
                 className={`py-2.5 text-sm font-bold rounded-xl transition-all ${
                   selectedRole === UserRole.PROVIDER 
                   ? 'bg-white text-primary-600 shadow-sm' 
                   : 'text-gray-400 hover:text-gray-600'
                 }`}
               >
                 {t.role_provider}
               </button>
            </div>

            <div className="space-y-4">
                {!isLogin && (
                  <Input 
                    label={t.name} 
                    icon="fa-user" 
                    placeholder={t.name} 
                    required 
                  />
                )}
                
                <Input 
                    label={t.email} 
                    icon="fa-envelope" 
                    placeholder="user@example.com" 
                    type="email"
                    required 
                />

                <Input 
                    label={t.password} 
                    icon="fa-lock" 
                    placeholder="••••••••" 
                    type="password"
                    required 
                />
            </div>

            <Button type="submit" className="w-full py-4 text-base shadow-lg shadow-primary-600/30 mt-6">
              {isLogin ? t.login_btn : t.register_btn}
            </Button>
          </form>

          {/* Social Login */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 backdrop-blur px-2 text-gray-400 font-bold tracking-wider">{t.or_continue}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <Button type="button" variant="secondary" className="w-full bg-white border border-gray-100 hover:bg-gray-50 text-gray-700">
                    <i className="fab fa-google text-red-500 text-lg ltr:mr-2 rtl:ml-2"></i> 
                    <span className="hidden sm:inline mx-1">{t.google}</span>
                 </Button>
                 <Button type="button" variant="secondary" className="w-full bg-white border border-gray-100 hover:bg-gray-50 text-gray-700">
                    <i className="fab fa-facebook text-blue-600 text-lg ltr:mr-2 rtl:ml-2"></i>
                    <span className="hidden sm:inline mx-1">{t.facebook}</span>
                 </Button>
                 <Button type="button" variant="secondary" className="w-full bg-white border border-gray-100 hover:bg-gray-50 text-gray-700">
                    <i className="fab fa-apple text-gray-900 text-lg ltr:mr-2 rtl:ml-2"></i>
                    <span className="hidden sm:inline mx-1">{t.apple}</span>
                 </Button>
            </div>

          <div className="mt-8 text-center">
            <Text variant="caption">
                {isLogin ? t.new_here : t.already_account}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="mx-2 text-primary-600 font-bold hover:underline"
                >
                  {isLogin ? t.register_btn : t.login_btn}
                </button>
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;