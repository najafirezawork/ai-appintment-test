import React, { useState, useMemo } from 'react';
import { Appointment, AppointmentStatus, User, UserRole } from '../types';
import { PROVIDERS, SERVICES, TRANSLATIONS } from '../constants';
import Button from '../components/Button';
import { Language } from '../App';

interface DashboardProps {
  user: User;
  appointments: Appointment[];
  onNewBooking: () => void;
  onCancel: (id: string) => void;
  lang: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ user, appointments, onNewBooking, onCancel, lang }) => {
  const t = TRANSLATIONS[lang];

  if (user.role === UserRole.PROVIDER) {
    return (
      <ProviderDashboard 
        user={user} 
        appointments={appointments} 
        t={t} 
        lang={lang} 
      />
    );
  }

  return (
    <PatientDashboard 
      appointments={appointments} 
      onNewBooking={onNewBooking} 
      onCancel={onCancel} 
      t={t} 
      lang={lang}
    />
  );
};

// --- Patient Dashboard Component ---
const PatientDashboard: React.FC<{ 
    appointments: Appointment[], 
    onNewBooking: () => void, 
    onCancel: (id: string) => void,
    t: any,
    lang: Language
}> = ({ appointments, onNewBooking, onCancel, t, lang }) => {
  
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  const upcoming = appointments.filter(a => new Date(a.date) > new Date() && a.status !== AppointmentStatus.CANCELLED);
  const nextAppointment = upcoming.length > 0 ? upcoming.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.dashboard}</h2>
          <p className="text-gray-500 mt-1 font-medium">{t.welcome_sub}</p>
        </div>
        <Button onClick={onNewBooking} className="shadow-lg shadow-primary/20">
          <i className="fas fa-plus"></i> {t.book_new}
        </Button>
      </div>

      {/* Hero Card - Next Appointment */}
      {nextAppointment ? (
         <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
               <div className="flex-1 text-center md:text-right rtl:md:text-right ltr:md:text-left">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm mb-3 inline-block">
                    UP NEXT
                  </span>
                  <h3 className="text-3xl font-bold mb-1">
                    {SERVICES.find(s => s.id === nextAppointment.serviceId)?.name}
                  </h3>
                  <p className="text-white/90 text-lg mb-4">
                    {PROVIDERS.find(p => p.id === nextAppointment.providerId)?.name}
                  </p>
                  <div className="flex gap-4 justify-center md:justify-start text-sm font-medium opacity-90">
                     <span className="flex items-center gap-2"><i className="fas fa-calendar"></i> {new Date(nextAppointment.date).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</span>
                     <span className="flex items-center gap-2"><i className="fas fa-clock"></i> {new Date(nextAppointment.date).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-auto min-w-[200px] text-center">
                  <div className="text-4xl font-bold mb-1">
                      {Math.ceil((new Date(nextAppointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-xs uppercase tracking-widest opacity-80">Days Left</div>
               </div>
            </div>
         </div>
      ) : (
         <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <i className="fas fa-calendar-plus text-2xl"></i>
             </div>
             <h3 className="text-xl font-bold text-gray-900">{t.no_appointments}</h3>
             <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">You have no upcoming visits. Book a new appointment to take care of your health.</p>
             <Button onClick={onNewBooking} variant="outline">{t.book_new}</Button>
         </div>
      )}

      {/* Appointments List */}
      <div>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xl font-bold text-gray-900">{t.upcoming_appointments}</h3>
           <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setFilterStatus('ALL')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterStatus === 'ALL' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>All</button>
              <button onClick={() => setFilterStatus(AppointmentStatus.CONFIRMED)} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterStatus === AppointmentStatus.CONFIRMED ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}>Confirmed</button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {upcoming
              .filter(a => filterStatus === 'ALL' || a.status === filterStatus)
              .map(apt => (
              <AppointmentCard 
                key={apt.id} 
                appointment={apt} 
                onCancel={onCancel} 
                t={t} 
                lang={lang} 
              />
            ))}
        </div>
      </div>
    </div>
  );
};

// --- Provider Dashboard Component ---
const ProviderDashboard: React.FC<{
    user: User,
    appointments: Appointment[],
    t: any,
    lang: Language
}> = ({ user, appointments, t, lang }) => {
    
    // Simulate provider specific data
    const myAppointments = appointments.filter(a => a.providerId === user.id && a.status !== AppointmentStatus.CANCELLED);
    const today = new Date();
    const todayAppointments = myAppointments.filter(a => {
        const d = new Date(a.date);
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900">{t.dashboard}</h2>
                    <p className="text-gray-500 mt-1">Dr. {user.name.split(' ').pop()}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {weekday: 'long'})}</p>
                    <p className="text-gray-400 text-sm">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                </div>
            </div>

            {/* Provider Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                        <i className="fas fa-users"></i>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold">{t.provider_stats_patients}</p>
                        <p className="text-3xl font-black text-gray-900">1.2k</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold">{t.provider_stats_today}</p>
                        <p className="text-3xl font-black text-gray-900">{todayAppointments.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">
                        <i className="fas fa-wallet"></i>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-bold">{t.provider_stats_income}</p>
                        <p className="text-3xl font-black text-gray-900">$12k</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Schedule List */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <i className="fas fa-clock text-primary"></i> {t.provider_schedule}
                    </h3>
                    
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {todayAppointments.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No appointments for today.</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {todayAppointments.map((apt, idx) => (
                                    <div key={apt.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="w-16 text-center">
                                            <div className="text-sm font-bold text-gray-900">
                                                {new Date(apt.date).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {hour:'2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0">
                                            <img src={`https://picsum.photos/200?random=${idx}`} className="w-full h-full rounded-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">Patient #{apt.userId.substring(0,3)}</h4>
                                            <p className="text-xs text-gray-500">{SERVICES.find(s => s.id === apt.serviceId)?.name}</p>
                                        </div>
                                        <button className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                                            {t.patient_details}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Next Patient Card */}
                <div className="w-full lg:w-1/3">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{t.provider_next_patient}</h3>
                    {todayAppointments.length > 0 ? (
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                            <div className="flex flex-col items-center text-center mt-4">
                                <div className="w-24 h-24 rounded-full p-1 border-2 border-primary border-dashed mb-4">
                                    <img src="https://picsum.photos/200?random=next" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">Patient #{todayAppointments[0].userId}</h4>
                                <p className="text-primary font-medium text-sm mb-6">{SERVICES.find(s => s.id === todayAppointments[0].serviceId)?.name}</p>
                                
                                <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">Time</span>
                                        <span className="font-bold text-gray-900">{new Date(todayAppointments[0].date).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-bold text-gray-900">In-Person</span>
                                    </div>
                                </div>

                                <Button className="w-full rounded-xl py-3 shadow-lg shadow-primary/20">
                                    {t.start_visit}
                                </Button>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-gray-50 rounded-3xl p-8 text-center border border-dashed border-gray-300 text-gray-400">
                             Free time!
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AppointmentCard: React.FC<{ appointment: Appointment, onCancel: (id: string) => void, t: any, lang: Language }> = ({ appointment, onCancel, t, lang }) => {
  const service = SERVICES.find(s => s.id === appointment.serviceId);
  const provider = PROVIDERS.find(p => p.id === appointment.providerId);
  const dateObj = new Date(appointment.date);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img src={provider?.imageUrl} alt={provider?.name} className="w-14 h-14 rounded-xl object-cover bg-gray-200 shadow-sm" />
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{service?.name}</h4>
            <p className="text-sm text-primary font-medium">{provider?.name}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <i className="fas fa-stethoscope"></i> {provider?.specialty}
            </p>
          </div>
        </div>
        <div className="text-right rtl:text-left ltr:text-right bg-gray-50 px-3 py-2 rounded-lg">
          <div className="text-lg font-black text-gray-900">
            {dateObj.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {dateObj.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-5 mt-3 border-t border-gray-50">
        <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full flex items-center gap-2">
          <i className="fas fa-video"></i> Online
        </span>
        <div className="flex gap-3">
           <button className="text-xs text-gray-500 hover:text-primary font-bold transition-colors">{t.reschedule}</button>
           <button onClick={() => onCancel(appointment.id)} className="text-xs text-red-500 hover:text-red-600 font-bold transition-colors bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">
               {t.cancel}
           </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;