import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { PROVIDERS, TRANSLATIONS } from '../constants';
import { Card, Button, Text, Avatar, Input, Badge } from '../components/NovaUI';
import { Language } from '../App';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, lang }) => {
  const t = TRANSLATIONS[lang];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '09123456789', // Mock data
    bio: '',
    specialty: '',
    location: 'Tehran, Iran',
  });

  const providerDetails = user.role === UserRole.PROVIDER 
    ? PROVIDERS.find(p => p.id === user.id) 
    : null;

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      bio: providerDetails?.bio || (user.role === UserRole.PATIENT ? 'No significant medical history.' : ''),
      specialty: providerDetails?.specialty || '',
    }));
  }, [user, providerDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-float bg-white">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary relative">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          {/* Decorative circles */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-end -mt-12 md:-mt-16 gap-4">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
               <div className="relative group">
                 <Avatar 
                    src={user.avatarUrl} 
                    name={user.name} 
                    size="xl" 
                    className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-lg text-4xl" 
                 />
                 {isEditing && (
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
                        <i className="fas fa-camera"></i>
                    </button>
                 )}
               </div>
               <div className="text-center md:text-right rtl:md:text-right ltr:md:text-left mb-2">
                  <Text variant="h2">{formData.name}</Text>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Badge status={user.role === UserRole.PROVIDER ? 'info' : 'success'} icon={user.role === UserRole.PROVIDER ? 'fa-user-doctor' : 'fa-user'}>
                        {user.role === UserRole.PROVIDER ? t.role_provider : t.role_patient}
                    </Badge>
                    {providerDetails && (
                        <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                            <i className="fas fa-stethoscope text-primary-500"></i> {providerDetails.specialty}
                        </span>
                    )}
                  </div>
               </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
               {isEditing ? (
                 <>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>{t.cancel_edit}</Button>
                    <Button onClick={handleSave}>{t.save_changes}</Button>
                 </>
               ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} icon="fa-pen" className="w-full md:w-auto">
                    {t.edit_profile}
                  </Button>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sidebar Info */}
        <Card className="space-y-6 h-fit">
           <div>
              <Text variant="h4" className="mb-4">{t.profile}</Text>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Text variant="caption">{t.email}</Text>
                        {isEditing ? (
                            <input 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-lg px-2 py-1 text-sm mt-1 focus:ring-2 focus:ring-primary-200 outline-none"
                            />
                        ) : (
                            <Text variant="body" className="font-medium truncate">{formData.email}</Text>
                        )}
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <i className="fas fa-phone"></i>
                    </div>
                    <div>
                        <Text variant="caption">{t.phone_number}</Text>
                        {isEditing ? (
                            <input 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-lg px-2 py-1 text-sm mt-1 focus:ring-2 focus:ring-primary-200 outline-none"
                            />
                        ) : (
                            <Text variant="body" className="font-medium">{formData.phone}</Text>
                        )}
                    </div>
                 </div>

                 <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <Text variant="caption">{t.location}</Text>
                        {isEditing ? (
                            <input 
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border-none rounded-lg px-2 py-1 text-sm mt-1 focus:ring-2 focus:ring-primary-200 outline-none"
                            />
                        ) : (
                            <Text variant="body" className="font-medium">{formData.location}</Text>
                        )}
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
            
            {/* Bio / About */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <Text variant="h3">{user.role === UserRole.PROVIDER ? t.bio : t.medical_history}</Text>
                    <i className={`fas ${user.role === UserRole.PROVIDER ? 'fa-user-md' : 'fa-file-medical'} text-gray-300 text-xl`}></i>
                </div>
                {isEditing ? (
                    <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none transition-all"
                    />
                ) : (
                    <Text variant="body" className="leading-7">
                        {formData.bio}
                    </Text>
                )}
            </Card>

            {/* Additional Info Cards based on Role */}
            {user.role === UserRole.PROVIDER ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card variant="white" className="bg-blue-50/50 border-blue-100">
                        <Text variant="caption" className="text-blue-600 mb-1">{t.experience}</Text>
                        <Text variant="h3" className="text-blue-900">15 {t.years}</Text>
                    </Card>
                    <Card variant="white" className="bg-emerald-50/50 border-emerald-100">
                        <Text variant="caption" className="text-emerald-600 mb-1">{t.stats_rating}</Text>
                        <div className="flex items-center gap-2">
                            <Text variant="h3" className="text-emerald-900">{providerDetails?.rating || '5.0'}</Text>
                            <div className="flex text-amber-400 text-sm">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                        </div>
                    </Card>
                 </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card variant="white">
                        <Text variant="caption" className="mb-2">{t.insurance_provider}</Text>
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">sos</div>
                             <Text variant="h4" className="text-base">SOS Insurance</Text>
                        </div>
                    </Card>
                    <Card variant="white">
                        <Text variant="caption" className="mb-2">{t.emergency_contact}</Text>
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold"><i className="fas fa-phone-alt"></i></div>
                             <div>
                                <Text variant="h4" className="text-base">Sarah (Wife)</Text>
                                <Text variant="small" className="text-gray-400">0912-987-6543</Text>
                             </div>
                        </div>
                    </Card>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Profile;