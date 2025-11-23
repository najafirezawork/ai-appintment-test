
import React, { useState, useMemo, useEffect } from 'react';
import { User, Appointment, Service, Provider, AppointmentStatus } from '../types';
import { SERVICES, PROVIDERS, TRANSLATIONS } from '../constants';
import { Button, Card, Text, Avatar, Badge, IconButton, Input } from '../components/NovaUI';
import { getSmartRecommendation } from '../services/geminiService';

interface BookingProps {
  user: User;
  onBookingComplete: (apt: Appointment) => void;
  onCancel: () => void;
}

type Step = 'SERVICE' | 'PROVIDER' | 'DATETIME' | 'CONFIRM';

const getSpecialtyIcon = (specialty: string) => {
    const s = specialty.toLowerCase();
    if (s.includes('cardio') || s.includes('heart')) return 'fa-heart-pulse';
    if (s.includes('dentist') || s.includes('tooth')) return 'fa-tooth';
    if (s.includes('vision') || s.includes('eye')) return 'fa-eye';
    if (s.includes('physio') || s.includes('therap')) return 'fa-person-running';
    if (s.includes('general')) return 'fa-user-doctor';
    if (s.includes('neuro')) return 'fa-brain';
    if (s.includes('derm')) return 'fa-spa';
    if (s.includes('ortho')) return 'fa-bone';
    if (s.includes('pediat')) return 'fa-baby';
    return 'fa-stethoscope';
};

const Booking: React.FC<BookingProps> = ({ user, onBookingComplete, onCancel }) => {
  const [step, setStep] = useState<Step>('SERVICE');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null); 
  
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  // Provider Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'rating'>('default');
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const lang = document.documentElement.lang as 'fa' | 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS['fa'];

  // Filter Logic
  const filteredProviders = useMemo(() => {
    let list = selectedService 
        ? PROVIDERS.filter(p => p.services.includes(selectedService.id))
        : PROVIDERS;

    // 1. Search Query
    if (searchQuery) {
        list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Availability Filter
    if (onlyAvailableToday) {
        const todayStr = new Date().toDateString();
        list = list.filter(p => p.availableSlots.some(slot => new Date(slot).toDateString() === todayStr));
    }

    // 3. Sorting
    if (sortBy === 'rating') {
        list = [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedService, searchQuery, onlyAvailableToday, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const paginatedProviders = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredProviders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProviders, currentPage]);

  // Date Grouping Logic for Step 3
  const slotsByDate = useMemo(() => {
    if (!selectedProvider) return {};
    const groups: Record<string, string[]> = {};
    selectedProvider.availableSlots.forEach(slot => {
      const date = new Date(slot);
      const key = date.toDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(slot);
    });
    return groups;
  }, [selectedProvider]);

  // Time of Day Grouping
  const timeGroups = useMemo(() => {
    if (!selectedDateKey || !slotsByDate[selectedDateKey]) return { morning: [], afternoon: [], evening: [] };
    
    const slots = slotsByDate[selectedDateKey];
    const groups: { morning: string[], afternoon: string[], evening: string[] } = {
        morning: [],
        afternoon: [],
        evening: []
    };

    slots.forEach(slot => {
        const hour = new Date(slot).getHours();
        if (hour < 12) groups.morning.push(slot);
        else if (hour < 17) groups.afternoon.push(slot);
        else groups.evening.push(slot);
    });
    
    return groups;
  }, [selectedDateKey, slotsByDate]);


  // Generate next 14 days for calendar strip
  const calendarDays = useMemo(() => {
      const days = [];
      const today = new Date();
      for (let i = 0; i < 14; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          days.push(d);
      }
      return days;
  }, []);

  // Auto-select first available date when entering DATETIME step
  useEffect(() => {
    if (step === 'DATETIME' && !selectedDateKey) {
        // Find first day that has slots
        const firstAvailable = calendarDays.find(d => slotsByDate[d.toDateString()]?.length > 0);
        if (firstAvailable) {
            setSelectedDateKey(firstAvailable.toDateString());
        }
    }
  }, [step, calendarDays, slotsByDate, selectedDateKey]);

  // Clear slot if date changes
  useEffect(() => {
    if (selectedDateKey && selectedSlot) {
        const slotDate = new Date(selectedSlot).toDateString();
        if (slotDate !== selectedDateKey) {
            setSelectedSlot(null);
        }
    }
  }, [selectedDateKey]);

  const handleAiSearch = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    const result = await getSmartRecommendation(prompt);
    setAiLoading(false);

    if (result) {
      if (result.serviceId) {
        const service = SERVICES.find(s => s.id === result.serviceId);
        if (service) setSelectedService(service);
      }
      if (result.providerId) {
        const provider = PROVIDERS.find(p => p.id === result.providerId);
        if (provider) setSelectedProvider(provider);
      }
      if (result.reasoning) {
        setAiSuggestion(result.reasoning);
      }
      if (result.serviceId && result.providerId) {
        setStep('DATETIME');
      } else if (result.serviceId) {
        setStep('PROVIDER');
      }
    }
  };

  const handleConfirm = () => {
    if (selectedService && selectedProvider && selectedSlot) {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        userId: user.id,
        serviceId: selectedService.id,
        providerId: selectedProvider.id,
        date: selectedSlot,
        status: AppointmentStatus.CONFIRMED,
      };
      onBookingComplete(newAppointment);
    }
  };

  const stepLabels: Record<Step, string> = {
    SERVICE: t.step_service,
    PROVIDER: t.step_provider,
    DATETIME: t.step_datetime,
    CONFIRM: t.step_confirm
  };

  const steps: Step[] = ['SERVICE', 'PROVIDER', 'DATETIME', 'CONFIRM'];
  const progressPercentage = ((steps.indexOf(step)) / (steps.length - 1)) * 100;

  // --- Render Sections ---

  const renderBookingSummarySidebar = () => (
    <div className="hidden lg:flex flex-col w-80 shrink-0 bg-white border-l border-gray-100 h-full p-6 sticky top-0 overflow-y-auto">
        <Text variant="h4" className="mb-6 pb-4 border-b border-gray-100">{t.summary_title}</Text>
        
        <div className="space-y-6 flex-1">
            {/* Service Selection */}
            <div className={`transition-all duration-300 ${selectedService ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <Text variant="small" className="mb-2 block">{t.summary_service}</Text>
                {selectedService ? (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <i className={`fas ${selectedService.icon}`}></i>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-900">{selectedService.name}</p>
                            <p className="text-xs text-gray-500">{selectedService.duration} min</p>
                        </div>
                        {step !== 'CONFIRM' && step !== 'SERVICE' && (
                            <button onClick={() => setStep('SERVICE')} className="ml-auto text-xs font-bold text-primary-600 hover:underline">{t.change}</button>
                        )}
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 italic">Select a service</div>
                )}
            </div>

            {/* Provider Selection */}
            <div className={`transition-all duration-300 ${selectedProvider ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <Text variant="small" className="mb-2 block">{t.summary_provider}</Text>
                {selectedProvider ? (
                    <div className="flex items-center gap-3">
                        <Avatar src={selectedProvider.imageUrl} name={selectedProvider.name} size="md" />
                        <div>
                            <p className="font-bold text-sm text-gray-900">{selectedProvider.name}</p>
                            <p className="text-xs text-gray-500">{selectedProvider.specialty}</p>
                        </div>
                        {step !== 'CONFIRM' && step !== 'PROVIDER' && step !== 'SERVICE' && (
                            <button onClick={() => setStep('PROVIDER')} className="ml-auto text-xs font-bold text-primary-600 hover:underline">{t.change}</button>
                        )}
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 italic">{t.summary_empty_provider}</div>
                )}
            </div>

            {/* Time Selection */}
            <div className={`transition-all duration-300 ${selectedSlot ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                <Text variant="small" className="mb-2 block">{t.summary_time}</Text>
                {selectedSlot ? (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                             <i className="fas fa-calendar-alt text-gray-400 text-xs"></i>
                             <p className="text-sm font-bold text-gray-900">{new Date(selectedSlot).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <i className="fas fa-clock text-gray-400 text-xs"></i>
                             <p className="text-sm font-bold text-gray-900">{new Date(selectedSlot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-400 italic">{t.summary_empty_time}</div>
                )}
            </div>
        </div>

        {/* Total Cost */}
        <div className="mt-auto pt-6 border-t border-dashed border-gray-200">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-500 font-medium text-sm">{t.summary_cost}</span>
                <span className="text-2xl font-black text-primary-600">
                    {selectedService ? selectedService.price : 0} <span className="text-base text-gray-400 font-bold">{t.currency}</span>
                </span>
            </div>
            
            {step === 'DATETIME' && (
                 <Button 
                    className="w-full py-4 shadow-xl shadow-primary-600/20" 
                    disabled={!selectedSlot} 
                    onClick={() => setStep('CONFIRM')}
                 >
                    {t.check_final}
                 </Button>
            )}
            
            {step === 'CONFIRM' && (
                 <Button 
                    className="w-full py-4 shadow-xl shadow-primary-600/20" 
                    onClick={handleConfirm}
                 >
                    {t.confirm_book}
                 </Button>
            )}
        </div>
  </div>
  );

  return (
    <div className="bg-surface rounded-3xl shadow-float overflow-hidden flex flex-col h-[calc(100vh-100px)] md:h-[850px] animate-slide-up relative">
      
      {/* Mobile Top Bar */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-4 shrink-0 lg:hidden">
         <IconButton icon={lang === 'fa' ? 'fa-arrow-right' : 'fa-arrow-left'} onClick={onCancel} />
         <div className="flex-1">
            <Text variant="h4" className="text-base">{stepLabels[step]}</Text>
            <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary-600 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Main Content Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-gray-50/30">
            
            {/* Desktop Back Button */}
            <div className="hidden lg:flex justify-between items-center mb-8">
                 <button onClick={onCancel} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors font-bold text-sm">
                     <i className={`fas ${lang === 'fa' ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i> {t.back}
                 </button>
                 
                 {/* Steps Indicator */}
                 <div className="flex gap-2">
                    {steps.map((s, idx) => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${steps.indexOf(step) >= idx ? 'w-8 bg-primary-600' : 'w-4 bg-gray-200'}`}></div>
                    ))}
                 </div>
            </div>

            {/* STEP 1: SERVICE */}
            {step === 'SERVICE' && (
                <div className="max-w-3xl mx-auto animate-fade-in">
                    {/* Hero AI Section */}
                    <div className="text-center mb-10 mt-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-3xl shadow-lg shadow-primary-500/40 rotate-6">
                            <i className="fas fa-sparkles"></i>
                        </div>
                        <Text variant="h2" className="mb-2 text-gray-900">{t.ai_title}</Text>
                        <Text variant="body" className="max-w-md mx-auto text-gray-500">{t.ai_subtitle}</Text>
                    </div>

                    <div className="relative mb-12 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative bg-white rounded-2xl p-2 flex items-center shadow-lg">
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t.ai_placeholder}
                                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 h-14 px-4 text-lg font-medium focus:ring-0"
                                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                            />
                            <Button onClick={handleAiSearch} isLoading={aiLoading} className="rounded-xl h-12 px-8 text-base shadow-none">
                                {t.search}
                            </Button>
                        </div>
                        {aiSuggestion && (
                            <div className="mt-4 bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 animate-slide-up">
                                <i className="fas fa-lightbulb text-amber-500 mt-1"></i>
                                <p className="text-sm text-amber-800 italic">"{aiSuggestion}"</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                         <div className="h-px bg-gray-200 flex-1"></div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or choose manually</span>
                         <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SERVICES.map(service => (
                            <div 
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service);
                                    setStep('PROVIDER');
                                }}
                                className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-5 hover:-translate-y-1 hover:shadow-card group ${selectedService?.id === service.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-100'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${selectedService?.id === service.id ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                                    <i className={`fas ${service.icon}`}></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg">{service.name}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-400 font-bold uppercase">{service.duration} min</span>
                                        <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{service.price} {t.currency}</span>
                                    </div>
                                </div>
                                <i className={`fas ${lang === 'fa' ? 'fa-chevron-left' : 'fa-chevron-right'} text-gray-300 group-hover:text-primary-400 transition-colors`}></i>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: PROVIDER */}
            {step === 'PROVIDER' && (
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                        <div>
                            <Text variant="h2" className="mb-1">{t.step_provider}</Text>
                            <Text variant="body" className="text-sm text-gray-500">Select a specialist for <span className="font-bold text-gray-800">{selectedService?.name}</span></Text>
                        </div>
                        <div className="flex gap-2">
                             <Input 
                                placeholder={t.search_doctor} 
                                className="py-2 text-sm bg-white min-w-[200px]" 
                                icon="fa-search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                             />
                        </div>
                    </div>

                    <div className="space-y-4 pb-20">
                        {paginatedProviders.map(provider => (
                            <div 
                                key={provider.id}
                                className={`bg-white p-5 rounded-3xl border transition-all flex flex-col md:flex-row gap-6 hover:shadow-float group ${selectedProvider?.id === provider.id ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-100'}`}
                            >
                                <div className="relative self-start">
                                    <Avatar src={provider.imageUrl} name={provider.name} size="xl" className="w-20 h-20 rounded-2xl" />
                                    <div className="absolute -bottom-2 -right-2 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100 flex items-center gap-1">
                                        <i className="fas fa-star text-amber-400 text-xs"></i>
                                        <span className="text-xs font-bold">{provider.rating}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.name}</h3>
                                            <p className="text-primary-600 font-medium text-sm mb-2">{provider.specialty}</p>
                                        </div>
                                        <Badge status="success" icon="fa-clock" className="hidden sm:inline-flex">{t.available_slots}</Badge>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{provider.bio}</p>
                                    
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg">
                                            <i className="fas fa-user-friends"></i> 1k+ Patients
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg">
                                            <i className="fas fa-briefcase-medical"></i> 15 Years Exp.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-end gap-3 md:w-40 md:border-l md:border-gray-50 md:pl-6 rtl:md:border-l-0 rtl:md:border-r rtl:md:pr-6">
                                     <div className="hidden md:block text-center mb-auto">
                                        <p className="text-xs text-gray-400 mb-1">Next Available</p>
                                        <p className="text-sm font-bold text-gray-800">Today, 4:00 PM</p>
                                     </div>
                                     <Button 
                                        variant={selectedProvider?.id === provider.id ? 'primary' : 'secondary'} 
                                        onClick={() => {
                                            setSelectedProvider(provider);
                                            setStep('DATETIME');
                                        }}
                                        className="w-full"
                                     >
                                        {selectedProvider?.id === provider.id ? <i className="fas fa-check"></i> : t.select_provider_btn}
                                     </Button>
                                </div>
                            </div>
                        ))}
                        
                        {paginatedProviders.length === 0 && (
                            <div className="text-center py-12">
                                <Text variant="h4" className="text-gray-400">{t.no_results_found}</Text>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 3: DATETIME */}
            {step === 'DATETIME' && selectedProvider && (
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                    <Text variant="h2" className="mb-6">{t.step_datetime}</Text>

                    {/* Calendar Strip */}
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8">
                        <div className="flex gap-3 overflow-x-auto pb-2 snap-x scroll-smooth hide-scrollbar px-1" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            {calendarDays.map(date => {
                                const dateKey = date.toDateString();
                                const slots = slotsByDate[dateKey] || [];
                                const isAvailable = slots.length > 0;
                                const isSelected = selectedDateKey === dateKey;
                                const fullDate = date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                                const statusLabel = !isAvailable ? (lang === 'fa' ? 'غیرقابل دسترس' : 'unavailable') : (isSelected ? (lang === 'fa' ? 'انتخاب شده' : 'selected') : '');
                                const ariaLabel = `${fullDate} ${statusLabel}`;
                                
                                return (
                                    <button
                                        key={dateKey}
                                        onClick={() => isAvailable && setSelectedDateKey(dateKey)}
                                        disabled={!isAvailable}
                                        aria-label={ariaLabel}
                                        aria-pressed={isSelected}
                                        className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[85px] py-4 rounded-2xl transition-all snap-start border ${
                                            isSelected 
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-105' 
                                            : isAvailable 
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border-transparent' 
                                                : 'bg-white text-gray-300 cursor-not-allowed border-transparent opacity-50'
                                        }`}
                                    >
                                        <span className="text-xs font-bold uppercase mb-1 opacity-70">
                                            {date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'short' })}
                                        </span>
                                        <span className="text-xl font-black mb-1">
                                            {date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { day: 'numeric' })}
                                        </span>
                                        {isAvailable && (
                                            <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-primary-400' : 'bg-emerald-500'}`}></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grouped Time Slots */}
                    <div className="space-y-8 animate-fade-in pb-20">
                        {selectedDateKey ? (
                            <>
                                {timeGroups.morning.length > 0 && (
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                            <i className="fas fa-sun text-amber-400"></i> {t.morning}
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                            {timeGroups.morning.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    aria-label={`${new Date(slot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}${selectedSlot === slot ? (lang === 'fa' ? ' انتخاب شده' : ' selected') : ''}`}
                                                    aria-pressed={selectedSlot === slot}
                                                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                                                        selectedSlot === slot 
                                                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/30 transform scale-105' 
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                                                    }`}
                                                >
                                                    {new Date(slot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {timeGroups.afternoon.length > 0 && (
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                            <i className="fas fa-cloud-sun text-orange-400"></i> {t.afternoon}
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                            {timeGroups.afternoon.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    aria-label={`${new Date(slot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}${selectedSlot === slot ? (lang === 'fa' ? ' انتخاب شده' : ' selected') : ''}`}
                                                    aria-pressed={selectedSlot === slot}
                                                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                                                        selectedSlot === slot 
                                                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/30 transform scale-105' 
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                                                    }`}
                                                >
                                                    {new Date(slot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {timeGroups.evening.length > 0 && (
                                    <div>
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                                            <i className="fas fa-moon text-indigo-400"></i> {t.evening}
                                        </h4>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                            {timeGroups.evening.map(slot => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    aria-label={`${new Date(slot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}${selectedSlot === slot ? (lang === 'fa' ? ' انتخاب شده' : ' selected') : ''}`}
                                                    aria-pressed={selectedSlot === slot}
                                                    className={`py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                                                        selectedSlot === slot 
                                                        ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/30 transform scale-105' 
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:text-primary-600'
                                                    }`}
                                                >
                                                    {new Date(slot).toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <i className="fas fa-calendar-times text-4xl text-gray-200 mb-4"></i>
                                <p className="text-gray-400">{t.no_appointments}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 4: CONFIRMATION (Mobile Only View, Desktop is in Sidebar) */}
            {step === 'CONFIRM' && (
                <div className="lg:hidden max-w-md mx-auto animate-fade-in">
                     <Text variant="h2" className="text-center mb-8">{t.check_final}</Text>
                     <Card className="shadow-float" noPadding>
                        <div className="bg-primary-50 p-8 border-b border-primary-100 flex flex-col items-center">
                            <Avatar src={selectedProvider?.imageUrl} name={selectedProvider?.name || ''} size="xl" className="shadow-lg mb-4" />
                            <Text variant="h3" className="text-center">{selectedProvider?.name}</Text>
                            <Text variant="caption" className="uppercase tracking-widest">{selectedProvider?.specialty}</Text>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.summary_service}</span>
                                <span className="font-bold text-gray-900">{selectedService?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t.summary_time}</span>
                                <span className="font-bold text-gray-900 text-right">
                                    {selectedSlot && new Date(selectedSlot).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-6 mt-6 flex justify-between items-center">
                                <span className="text-gray-500">{t.summary_cost}</span>
                                <span className="text-3xl font-black text-primary-600">{selectedService?.price} {t.currency}</span>
                            </div>
                        </div>
                     </Card>
                     
                     <div className="mt-8 flex gap-4">
                        <Button variant="secondary" onClick={() => setStep('DATETIME')} className="flex-1">{t.back}</Button>
                        <Button onClick={handleConfirm} className="flex-[2] shadow-xl shadow-primary-600/30">{t.confirm_book}</Button>
                     </div>
                </div>
            )}

         </div>

         {/* Sidebar Summary (Desktop) */}
         {renderBookingSummarySidebar()}

      </div>
    </div>
  );
};

export default Booking;
