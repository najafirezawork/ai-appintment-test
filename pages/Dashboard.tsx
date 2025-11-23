import React, { useState, useMemo, useEffect } from 'react';
import { Appointment, AppointmentStatus, User, UserRole } from '../types';
import { PROVIDERS, SERVICES, TRANSLATIONS } from '../constants';
import { Card, Button, Badge, Text, Avatar, Input, IconButton, Modal } from '../components/NovaUI';
import { Language } from '../App';

interface DashboardProps {
  user: User;
  appointments: Appointment[];
  onNewBooking: () => void;
  onCancel: (id: string) => void;
  lang: Language;
  setLoading: (loading: boolean) => void;
}

// --- Components ---

const AppointmentCard: React.FC<{ appointment: Appointment, onCancel: (id: string) => void, t: any, lang: Language }> = ({ appointment, onCancel, t, lang }) => {
  const service = SERVICES.find(s => s.id === appointment.serviceId);
  const provider = PROVIDERS.find(p => p.id === appointment.providerId);
  const dateObj = new Date(appointment.date);

  const getStatusBadge = () => {
    switch (appointment.status) {
        case AppointmentStatus.CONFIRMED:
            return <Badge status="success" icon="fa-check">{t.status_confirmed}</Badge>;
        default:
            return <Badge status="warning" icon="fa-clock">{t.status_pending}</Badge>;
    }
  };

  return (
    <Card variant="hover" className="group h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
            <div className="flex gap-4">
            <Avatar src={provider?.imageUrl} name={provider?.name || 'Dr'} size="lg" className="rounded-2xl" />
            <div>
                <Text variant="h4">{service?.name}</Text>
                <Text variant="caption" className="text-primary-600 font-bold">{provider?.name}</Text>
                <Text variant="small" className="text-gray-400 mt-1 flex items-center gap-1 lowercase">
                    <i className="fas fa-stethoscope"></i> {provider?.specialty}
                </Text>
            </div>
            </div>
            <div className="text-right rtl:text-left ltr:text-right px-4 py-2 rounded-xl bg-surface-hover group-hover:bg-primary-50 transition-colors">
            <div className="text-xl font-black text-gray-900 group-hover:text-primary-700">
                {dateObj.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide group-hover:text-primary-600/70">
                {dateObj.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'short', day: 'numeric' })}
            </div>
            </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-5 mt-4 border-t border-gray-100">
        <div className="flex gap-2">
             {getStatusBadge()}
             <Badge status="info" icon="fa-video">
                {t.online_visit}
             </Badge>
        </div>
        
        <div className="flex gap-2">
            <Button size="sm" variant="ghost">
                {t.reschedule}
            </Button>
            <Button size="sm" variant="danger" onClick={() => onCancel(appointment.id)} className="bg-red-50 hover:bg-red-100 text-red-600">
                {t.cancel}
            </Button>
        </div>
      </div>
    </Card>
  );
}

const HistoryRow: React.FC<{ appointment: Appointment, t: any, lang: Language }> = ({ appointment, t, lang }) => {
  const service = SERVICES.find(s => s.id === appointment.serviceId);
  const provider = PROVIDERS.find(p => p.id === appointment.providerId);
  const dateObj = new Date(appointment.date);

  const getStatusBadge = () => {
    switch (appointment.status) {
        case AppointmentStatus.COMPLETED:
            return <Badge status="success" icon="fa-check-circle">{t.status_completed}</Badge>;
        case AppointmentStatus.CANCELLED:
            return <Badge status="error" icon="fa-ban">{t.status_cancelled}</Badge>;
        case AppointmentStatus.CONFIRMED:
            return <Badge status="success" icon="fa-check">{t.status_confirmed}</Badge>;
        default:
            return <Badge status="warning" icon="fa-clock">{t.status_pending}</Badge>;
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-gray-50 group shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
             <span className="text-xs font-bold text-gray-400 uppercase">{dateObj.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { month: 'short' })}</span>
             <span className="text-xl font-black text-gray-800">{dateObj.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { day: 'numeric' })}</span>
        </div>
        
        <div className="flex-1">
             <Text variant="h4" className="text-base text-gray-700">{service?.name}</Text>
             <div className="flex items-center gap-2 mt-1">
                <Avatar src={provider?.imageUrl} name={provider?.name || 'Dr'} size="sm" className="w-5 h-5 text-[10px]" />
                <Text variant="caption" className="text-xs">{provider?.name}</Text>
             </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-0 sm:pl-4 border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0">
         <span className="text-sm font-bold text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-lg">
            {dateObj.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
         </span>
         {getStatusBadge()}
      </div>
    </div>
  );
};

const PatientDashboard: React.FC<{ 
    appointments: Appointment[], 
    onNewBooking: () => void, 
    onCancel: (id: string) => void,
    t: any,
    lang: Language
}> = ({ appointments, onNewBooking, onCancel, t, lang }) => {
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Date range filters for history
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const now = new Date();

  const upcoming = useMemo(() => {
    return appointments.filter(a => {
        const d = new Date(a.date);
        return d >= now && a.status !== AppointmentStatus.CANCELLED && a.status !== AppointmentStatus.COMPLETED;
    });
  }, [appointments, now]);

  const history = useMemo(() => {
    return appointments.filter(a => {
        const d = new Date(a.date);
        return d < now || a.status === AppointmentStatus.CANCELLED || a.status === AppointmentStatus.COMPLETED;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, now]);

  const nextAppointment = upcoming.length > 0 ? [...upcoming].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] : null;

  const filteredList = useMemo(() => {
    const list = activeTab === 'upcoming' ? upcoming : history;
    
    return list.filter(a => {
        // Search Filter
        const provider = PROVIDERS.find(p => p.id === a.providerId);
        const service = SERVICES.find(s => s.id === a.serviceId);
        const matchesSearch = searchQuery === '' || 
            (provider?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (service?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

        // Status Filter
        let matchesStatus = true;
        if (filterStatus !== 'ALL') {
            matchesStatus = a.status === filterStatus;
        }

        // Date Range Filter (Only for History)
        let matchesDate = true;
        if (activeTab === 'history') {
            const d = new Date(a.date).getTime();
            if (dateFrom && !isNaN(new Date(dateFrom).getTime())) {
                 matchesDate = matchesDate && d >= new Date(dateFrom).getTime();
            }
            if (dateTo && !isNaN(new Date(dateTo).getTime())) {
                 // Add 1 day to include the end date completely
                 matchesDate = matchesDate && d <= new Date(dateTo).getTime() + 86400000;
            }
        }

        return matchesStatus && matchesSearch && matchesDate;
    });
  }, [activeTab, upcoming, history, filterStatus, searchQuery, dateFrom, dateTo]);

  // Reset filters when changing tabs
  useEffect(() => {
      setFilterStatus('ALL');
      setSearchQuery('');
      setDateFrom('');
      setDateTo('');
  }, [activeTab]);

  const initiateCancel = (id: string) => {
    setSelectedAppointmentId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedAppointmentId) {
        onCancel(selectedAppointmentId);
        setCancelModalOpen(false);
        setSelectedAppointmentId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Text variant="h2">{t.dashboard}</Text>
          <Text variant="caption" className="mt-1 text-lg">{t.welcome_sub}</Text>
        </div>
        <Button onClick={onNewBooking} icon="fa-plus">
          {t.book_new}
        </Button>
      </div>

      {/* Hero Card - Next Appointment (Only in Upcoming view) */}
      {activeTab === 'upcoming' && (
          nextAppointment ? (
             <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-glow relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                   <div className="flex-1 text-center md:text-right rtl:md:text-right ltr:md:text-left">
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md mb-4 inline-block border border-white/10">
                        {t.up_next}
                      </span>
                      <Text variant="h2" className="text-white mb-1">
                        {SERVICES.find(s => s.id === nextAppointment.serviceId)?.name}
                      </Text>
                      <p className="text-primary-100 text-lg mb-6 font-medium">
                        {PROVIDERS.find(p => p.id === nextAppointment.providerId)?.name}
                      </p>
                      <div className="flex gap-6 justify-center md:justify-start text-sm font-semibold text-white/90">
                         <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/5"><i className="fas fa-calendar"></i> {new Date(nextAppointment.date).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US')}</span>
                         <span className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/5"><i className="fas fa-clock"></i> {new Date(nextAppointment.date).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-auto min-w-[180px] text-center shadow-lg">
                      <div className="text-5xl font-black mb-2 text-white">
                          {Math.ceil((new Date(nextAppointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-primary-100 font-bold">{t.days_left}</div>
                   </div>
                </div>
             </div>
          ) : (
             <Card className="text-center py-12 border-dashed">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <i className="fas fa-calendar-plus text-2xl"></i>
                 </div>
                 <Text variant="h3" className="mb-2">{t.no_appointments}</Text>
                 <Text variant="body" className="max-w-md mx-auto mb-6">{t.no_appointments_sub}</Text>
                 <Button onClick={onNewBooking} variant="outline" icon="fa-plus">{t.book_new}</Button>
             </Card>
          )
      )}

      {/* List Section with Tabs and Filters */}
      <div>
        <div className="flex flex-col gap-6 mb-6">
           {/* Tabs */}
           <div className="flex border-b border-gray-100">
               <button 
                 onClick={() => setActiveTab('upcoming')} 
                 className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'upcoming' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {t.tab_upcoming}
                 {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>}
               </button>
               <button 
                 onClick={() => setActiveTab('history')} 
                 className={`pb-4 px-6 text-sm font-bold transition-all relative ${activeTab === 'history' ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {t.tab_history}
                 {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>}
               </button>
           </div>
           
           {/* Filters */}
           <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
               <div className="w-full lg:flex-1">
                    <Input 
                        icon="fa-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.search_doctor}
                        className="py-2.5 bg-white"
                        label={t.search}
                    />
               </div>
               
               <div className="w-full lg:w-auto flex gap-4 overflow-x-auto pb-1 lg:pb-0 items-end">
                    <div className="flex bg-gray-100 p-1 rounded-xl h-[46px] items-center shrink-0">
                        <button onClick={() => setFilterStatus('ALL')} className={`px-4 h-full text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filterStatus === 'ALL' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                            {t.filter_all}
                        </button>
                        
                        {activeTab === 'upcoming' ? (
                            <button onClick={() => setFilterStatus(AppointmentStatus.CONFIRMED)} className={`px-4 h-full text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filterStatus === AppointmentStatus.CONFIRMED ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                {t.filter_confirmed}
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setFilterStatus(AppointmentStatus.COMPLETED)} className={`px-4 h-full text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filterStatus === AppointmentStatus.COMPLETED ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {t.filter_completed}
                                </button>
                                <button onClick={() => setFilterStatus(AppointmentStatus.CANCELLED)} className={`px-4 h-full text-xs font-bold rounded-lg transition-all whitespace-nowrap ${filterStatus === AppointmentStatus.CANCELLED ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {t.filter_cancelled}
                                </button>
                            </>
                        )}
                    </div>
               </div>

               {/* Date Filters (Only History) */}
               {activeTab === 'history' && (
                 <div className="flex gap-2 w-full lg:w-auto shrink-0 animate-fade-in">
                    <div className="w-1/2 lg:w-36">
                        <Input 
                           type="date" 
                           label={t.date_from}
                           placeholder={t.date_from} 
                           value={dateFrom} 
                           onChange={(e) => setDateFrom(e.target.value)} 
                           className="py-2.5 text-xs bg-white"
                        />
                    </div>
                    <div className="w-1/2 lg:w-36">
                        <Input 
                           type="date" 
                           label={t.date_to}
                           placeholder={t.date_to} 
                           value={dateTo} 
                           onChange={(e) => setDateTo(e.target.value)} 
                           className="py-2.5 text-xs bg-white"
                        />
                    </div>
                 </div>
               )}
           </div>
        </div>

        {/* Results Grid / List */}
        <div>
            {filteredList.length > 0 ? (
                <div className={activeTab === 'upcoming' ? "grid grid-cols-1 lg:grid-cols-2 gap-5" : "flex flex-col gap-3"}>
                    {filteredList.map(apt => (
                        activeTab === 'upcoming' ? (
                            <AppointmentCard 
                                key={apt.id} 
                                appointment={apt} 
                                onCancel={initiateCancel} 
                                t={t} 
                                lang={lang}
                            />
                        ) : (
                            <HistoryRow 
                                key={apt.id} 
                                appointment={apt} 
                                t={t} 
                                lang={lang} 
                            />
                        )
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                         <i className={`fas ${activeTab === 'history' ? 'fa-history' : 'fa-calendar-times'} text-2xl`}></i>
                    </div>
                    <Text variant="h3" className="mb-2 text-gray-600">{activeTab === 'upcoming' ? t.no_appointments : t.no_history}</Text>
                    <Text variant="caption">{t.no_appointments_sub}</Text>
                </div>
            )}
        </div>
      </div>

      <Modal 
        isOpen={cancelModalOpen} 
        onClose={() => setCancelModalOpen(false)}
        title={t.cancel_confirm_title}
        footer={
            <>
                <Button variant="ghost" onClick={() => setCancelModalOpen(false)}>{t.no}</Button>
                <Button variant="danger" onClick={handleConfirmCancel}>{t.yes}</Button>
            </>
        }
      >
        <Text variant="body">{t.cancel_confirm_message}</Text>
      </Modal>

    </div>
  );
};

const ProviderDashboard: React.FC<{
    user: User,
    appointments: Appointment[],
    t: any,
    lang: Language
}> = ({ user, appointments, t, lang }) => {
    
    const myAppointments = appointments.filter(a => a.providerId === user.id && a.status !== AppointmentStatus.CANCELLED);
    const today = new Date();
    const todayAppointments = myAppointments.filter(a => {
        const d = new Date(a.date);
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
             <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-soft border border-gray-100">
                <div className="flex items-center gap-4">
                    <Avatar name={user.name} src={user.avatarUrl} size="lg" />
                    <div>
                        <Text variant="h2">{t.dashboard}</Text>
                        <Text variant="caption">Dr. {user.name.split(' ').pop()}</Text>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-black text-primary-600">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {weekday: 'long'})}</p>
                    <p className="text-gray-400 text-sm font-bold">{new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                </div>
            </div>

            {/* Provider Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i className="fas fa-users"></i>
                    </div>
                    <div>
                        <Text variant="small" className="text-gray-500 mb-1">{t.provider_stats_patients}</Text>
                        <Text variant="h2">1.2k</Text>
                    </div>
                </Card>
                <Card className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <div>
                        <Text variant="small" className="text-gray-500 mb-1">{t.provider_stats_today}</Text>
                        <Text variant="h2">{todayAppointments.length}</Text>
                    </div>
                </Card>
                <Card className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                        <i className="fas fa-wallet"></i>
                    </div>
                    <div>
                        <Text variant="small" className="text-gray-500 mb-1">{t.provider_stats_income}</Text>
                        <Text variant="h2">$12k</Text>
                    </div>
                </Card>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Schedule List */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                         <Text variant="h3" className="flex items-center gap-2">
                            <i className="fas fa-clock text-primary-500"></i> {t.provider_schedule}
                        </Text>
                        <IconButton icon="fa-ellipsis-h" />
                    </div>
                    
                    <Card noPadding className="overflow-hidden">
                        {todayAppointments.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <i className="fas fa-mug-hot text-4xl mb-4 text-gray-300"></i>
                                <p>{t.no_visits_today}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {todayAppointments.map((apt, idx) => (
                                    <div key={apt.id} className="p-5 flex items-center gap-4 hover:bg-gray-50/80 transition-colors group cursor-pointer">
                                        <div className="w-20 text-center bg-gray-100 rounded-xl py-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <div className="text-sm font-black text-gray-900">
                                                {new Date(apt.date).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {hour:'2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        <Avatar src={`https://picsum.photos/200?random=${idx}`} name="Patient" size="md" />
                                        <div className="flex-1">
                                            <Text variant="h4" className="text-base">{t.patient_id} #{apt.userId.substring(0,3)}</Text>
                                            <Text variant="caption">{SERVICES.find(s => s.id === apt.serviceId)?.name}</Text>
                                        </div>
                                        <Button size="sm" variant="secondary" className="bg-white">
                                            {t.patient_details}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Side: Next Patient Card */}
                <div className="w-full lg:w-1/3">
                    <Text variant="h3" className="mb-6">{t.provider_next_patient}</Text>
                    {todayAppointments.length > 0 ? (
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-float relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                            <div className="flex flex-col items-center text-center mt-2">
                                <div className="w-28 h-28 rounded-full p-1.5 border-2 border-primary-100 border-dashed mb-6 relative">
                                    <Avatar src="https://picsum.photos/200?random=next" name="Next" size="xl" className="w-full h-full" />
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                                </div>
                                <Text variant="h3" className="mb-1">{t.patient_id} #{todayAppointments[0].userId}</Text>
                                <Badge status="info" icon="fa-stethoscope" >
                                    {SERVICES.find(s => s.id === todayAppointments[0].serviceId)?.name}
                                </Badge>
                                
                                <div className="w-full bg-surface rounded-2xl p-5 my-8 border border-gray-100">
                                    <div className="flex justify-between text-sm mb-3">
                                        <span className="text-gray-500 font-medium">{t.time_label}</span>
                                        <span className="font-bold text-gray-900">{new Date(todayAppointments[0].date).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">{t.type_label}</span>
                                        <span className="font-bold text-gray-900">{t.in_person}</span>
                                    </div>
                                </div>

                                <Button className="w-full py-4 shadow-lg shadow-primary-600/20">
                                    {t.start_visit}
                                </Button>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-gray-50 rounded-3xl p-10 text-center border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center h-64">
                             <i className="fas fa-smile-beam text-4xl mb-3 text-gray-300"></i>
                             {t.free_time}
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ user, appointments, onNewBooking, onCancel, lang, setLoading }) => {
  const t = TRANSLATIONS[lang];

  // Simulate data fetching on mount
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

export default Dashboard;