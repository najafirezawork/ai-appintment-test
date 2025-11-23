import React, { useState } from 'react';
import { User, Appointment, Service, Provider, AppointmentStatus } from '../types';
import { SERVICES, PROVIDERS, TRANSLATIONS } from '../constants';
import { Button, Card, Text, Avatar, Badge, IconButton } from '../components/NovaUI';
import { getSmartRecommendation } from '../services/geminiService';

interface BookingProps {
  user: User;
  onBookingComplete: (apt: Appointment) => void;
  onCancel: () => void;
}

type Step = 'SERVICE' | 'PROVIDER' | 'DATETIME' | 'CONFIRM';

const Booking: React.FC<BookingProps> = ({ user, onBookingComplete, onCancel }) => {
  const [step, setStep] = useState<Step>('SERVICE');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const lang = document.documentElement.lang as 'fa' | 'en';
  const t = TRANSLATIONS[lang] || TRANSLATIONS['fa'];

  // Filter providers based on selected service
  const availableProviders = selectedService 
    ? PROVIDERS.filter(p => p.services.includes(selectedService.id))
    : PROVIDERS;

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

  return (
    <div className="bg-white rounded-3xl shadow-float border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-120px)] md:h-[800px] animate-slide-up">
      {/* Header with Steps */}
      <div className="bg-white p-6 md:p-8 border-b border-gray-100 z-10">
        <div className="flex justify-between items-center mb-8">
           <Text variant="h2">{t.booking}</Text>
           <IconButton icon="fa-times" onClick={onCancel} />
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between relative px-2" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
          <div className="absolute left-0 right-0 top-4 h-1 bg-gray-100 -z-0 rounded-full mx-4"></div>
          {steps.map((s, idx) => {
            const currentIdx = steps.indexOf(step);
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;
            
            return (
              <div key={s} className="z-10 flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-4 border-white ${
                  isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-110' : 
                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? <i className="fas fa-check"></i> : idx + 1}
                </div>
                <Text variant="small" className={`mt-2 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                  {stepLabels[s]}
                </Text>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface">
        
        {/* Step 1: Service Selection */}
        {step === 'SERVICE' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* AI Assistant Input */}
            <div className="relative mb-10">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-secondary rounded-2xl blur opacity-30 animate-pulse"></div>
               <Card noPadding className="relative p-2 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 text-lg shrink-0`}>
                      <i className="fas fa-sparkles"></i>
                  </div>
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t.ai_placeholder}
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 h-12 px-2 font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                  />
                  <Button 
                    onClick={handleAiSearch}
                    isLoading={aiLoading}
                    className="rounded-xl px-6 h-12"
                  >
                    {t.search}
                  </Button>
               </Card>
               {aiSuggestion && (
                 <Card variant="white" className="mt-4 flex items-start gap-4 animate-fade-in border-primary-100">
                    <div className="w-8 h-8 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <i className="fas fa-lightbulb"></i>
                    </div>
                    <Text variant="body" className="text-sm italic">
                      "{aiSuggestion}"
                    </Text>
                 </Card>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(service => (
                <Card 
                  key={service.id}
                  variant={selectedService?.id === service.id ? 'white' : 'white'}
                  onClick={() => {
                    setSelectedService(service);
                    setStep('PROVIDER');
                  }}
                  className={`cursor-pointer transition-all hover:-translate-y-1 hover:shadow-card flex items-center gap-5 relative overflow-hidden group ${
                    selectedService?.id === service.id ? 'ring-2 ring-primary-500 bg-primary-50/30' : ''
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${
                    selectedService?.id === service.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'bg-gray-100 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600'
                  }`}>
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <div>
                    <Text variant="h4" className="mb-1">{service.name}</Text>
                    <Text variant="caption">{service.duration} min • <span className="text-primary-600 font-bold">{service.price} {t.currency}</span></Text>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Provider Selection */}
        {step === 'PROVIDER' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
             {availableProviders.map(provider => (
                <Card 
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider);
                    setStep('DATETIME');
                  }}
                  className={`cursor-pointer transition-all hover:shadow-card hover:-translate-y-1 group ${
                    selectedProvider?.id === provider.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                      <Avatar src={provider.imageUrl} name={provider.name} size="xl" className="mb-4 group-hover:scale-105 transition-transform" />
                      <Text variant="h3" className="mb-1">{provider.name}</Text>
                      <Text variant="caption" className="text-primary-600 font-bold mb-3 uppercase tracking-wider">{provider.specialty}</Text>
                      <Badge status="warning" icon="fa-star">{provider.rating}</Badge>
                      <Text variant="body" className="text-sm text-gray-500 mt-4 line-clamp-2">{provider.bio}</Text>
                  </div>
                </Card>
             ))}
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 'DATETIME' && selectedProvider && (
          <div className="max-w-4xl mx-auto">
            <Card className="flex items-center gap-4 mb-8">
               <Avatar src={selectedProvider.imageUrl} name={selectedProvider.name} size="md" />
               <div>
                 <Text variant="small" className="text-gray-400 mb-0.5">{t.available_slots}</Text>
                 <Text variant="h4">{selectedProvider.name}</Text>
               </div>
            </Card>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedProvider.availableSlots.map(slot => {
                const date = new Date(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-1 ${
                      isSelected 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-600/20 scale-105' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:shadow-soft'
                    }`}
                  >
                    <Text variant="small" className={`${isSelected ? 'text-primary-100' : 'text-gray-400'}`}>
                        {date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'short', day: 'numeric' })}
                    </Text>
                    <Text variant="h4" className={`text-lg font-black tracking-tight ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {date.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'CONFIRM' && selectedService && selectedProvider && selectedSlot && (
           <Card className="max-w-md mx-auto" noPadding>
             <div className="bg-primary-50 p-6 border-b border-primary-100">
                <Text variant="h3" className="text-primary-800 text-center">{t.summary_title}</Text>
             </div>
             <div className="p-8 space-y-6">
               <div className="flex justify-between items-center">
                 <Text variant="caption">{t.summary_service}</Text>
                 <Text variant="h4">{selectedService.name}</Text>
               </div>
               <div className="flex justify-between items-center">
                 <Text variant="caption">{t.summary_provider}</Text>
                 <div className="flex items-center gap-2">
                    <Avatar src={selectedProvider.imageUrl} name={selectedProvider.name} size="sm" />
                    <Text variant="body" className="font-bold">{selectedProvider.name}</Text>
                 </div>
               </div>
               <div className="flex justify-between items-center">
                 <Text variant="caption">{t.summary_time}</Text>
                 <Badge status="neutral">
                   {new Date(selectedSlot).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                 </Badge>
               </div>
               
               <div className="border-t border-dashed border-gray-200 pt-6 mt-6">
                 <div className="flex justify-between items-end">
                    <Text variant="caption">{t.summary_cost}</Text>
                    <Text variant="h2" className="text-primary-600">{selectedService.price} {t.currency}</Text>
                 </div>
               </div>
             </div>
           </Card>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 md:p-8 border-t border-gray-100 flex justify-between bg-white z-10">
        {step !== 'SERVICE' ? (
          <Button 
            variant="secondary" 
            onClick={() => {
              if (step === 'CONFIRM') setStep('DATETIME');
              else if (step === 'DATETIME') setStep('PROVIDER');
              else if (step === 'PROVIDER') setStep('SERVICE');
            }}
            icon={lang === 'fa' ? 'fa-arrow-right' : 'fa-arrow-left'}
          >
            {t.back}
          </Button>
        ) : <div></div>}
        
        <div className={`flex-1 flex justify-end`}>
           {step === 'DATETIME' && (
             <Button disabled={!selectedSlot} onClick={() => setStep('CONFIRM')} icon="fa-check">{t.check_final}</Button>
           )}
           {step === 'CONFIRM' && (
             <Button onClick={handleConfirm} className="px-8 shadow-xl shadow-primary-600/30">{t.confirm_book}</Button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Booking;