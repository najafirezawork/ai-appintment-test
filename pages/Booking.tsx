import React, { useState } from 'react';
import { User, Appointment, Service, Provider, AppointmentStatus } from '../types';
import { SERVICES, PROVIDERS } from '../constants';
import Button from '../components/Button';
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

  // Filter providers based on selected service
  const availableProviders = selectedService 
    ? PROVIDERS.filter(p => p.services.includes(selectedService.id))
    : PROVIDERS;

  const handleAiSearch = async (query: string) => {
    if (!query.trim()) return;
    setAiLoading(true);
    const result = await getSmartRecommendation(query);
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
      // If both found, jump to datetime
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
    SERVICE: 'خدمت',
    PROVIDER: 'پزشک',
    DATETIME: 'زمان',
    CONFIRM: 'تایید'
  };

  const steps: Step[] = ['SERVICE', 'PROVIDER', 'DATETIME', 'CONFIRM'];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full max-h-[800px]">
      {/* Header with Steps */}
      <div className="bg-gray-50 p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-gray-900">رزرو نوبت</h2>
           <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between relative" dir="rtl">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-0"></div>
          {steps.map((s, idx) => {
            const currentIdx = steps.indexOf(step);
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;
            
            return (
              <div key={s} className="z-10 flex flex-col items-center bg-gray-50 px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive ? 'bg-primary text-white ring-4 ring-primary/20' : 
                  isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? <i className="fas fa-check"></i> : idx + 1}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                  {stepLabels[s]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Step 1: Service Selection */}
        {step === 'SERVICE' && (
          <div className="space-y-6">
            {/* AI Assistant Input */}
            <div className="bg-gradient-to-l from-primary/5 to-blue-500/5 p-4 rounded-xl border border-primary/10">
              <label className="text-sm font-bold text-primary mb-2 block">
                <i className="fas fa-sparkles ml-1"></i> دستیار هوشمند
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  id="ai-prompt"
                  placeholder="مثلا: 'درد شدید در ناحیه کمر دارم'"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAiSearch((e.target as HTMLInputElement).value);
                  }}
                />
                <Button 
                  onClick={() => {
                     const input = document.getElementById('ai-prompt') as HTMLInputElement;
                     handleAiSearch(input.value);
                  }}
                  isLoading={aiLoading}
                  className="shrink-0"
                >
                  جستجو
                </Button>
              </div>
              {aiSuggestion && (
                 <p className="text-xs text-gray-600 mt-2 bg-white p-2 rounded border border-gray-100 italic">
                   "{aiSuggestion}"
                 </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(service => (
                <div 
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep('PROVIDER');
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md flex items-center gap-4 ${
                    selectedService?.id === service.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                    selectedService?.id === service.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{service.name}</h3>
                    <p className="text-xs text-gray-500">{service.duration} دقیقه • {service.price} تومان</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Provider Selection */}
        {step === 'PROVIDER' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {availableProviders.map(provider => (
                <div 
                  key={provider.id}
                  onClick={() => {
                    setSelectedProvider(provider);
                    setStep('DATETIME');
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md flex items-start gap-4 ${
                    selectedProvider?.id === provider.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50'
                  }`}
                >
                  <img src={provider.imageUrl} alt={provider.name} className="w-16 h-16 rounded-full object-cover bg-gray-200" />
                  <div>
                    <h3 className="font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-primary font-medium">{provider.specialty}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 mt-1">
                      <i className="fas fa-star"></i> {provider.rating}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{provider.bio}</p>
                  </div>
                </div>
             ))}
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 'DATETIME' && selectedProvider && (
          <div>
            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
               <img src={selectedProvider.imageUrl} className="w-10 h-10 rounded-full" />
               <div>
                 <p className="text-sm text-gray-500">زمان‌های خالی برای</p>
                 <p className="font-bold text-gray-900">{selectedProvider.name}</p>
               </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {selectedProvider.availableSlots.map(slot => {
                const date = new Date(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isSelected 
                      ? 'bg-primary text-white border-primary shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-xs opacity-80">{date.toLocaleDateString('fa-IR', { weekday: 'short', day: 'numeric' })}</div>
                    <div className="font-bold">{date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'CONFIRM' && selectedService && selectedProvider && selectedSlot && (
           <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
             <h3 className="font-bold text-gray-900 mb-4">خلاصه رزرو</h3>
             
             <div className="space-y-4">
               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="text-gray-500">خدمت</span>
                 <span className="font-medium">{selectedService.name}</span>
               </div>
               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="text-gray-500">پزشک</span>
                 <span className="font-medium">{selectedProvider.name}</span>
               </div>
               <div className="flex justify-between border-b border-gray-200 pb-2">
                 <span className="text-gray-500">تاریخ و زمان</span>
                 <span className="font-medium">
                   {new Date(selectedSlot).toLocaleString('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })}
                 </span>
               </div>
               <div className="flex justify-between pt-2">
                 <span className="text-gray-500">هزینه نهایی</span>
                 <span className="font-bold text-xl text-primary">{selectedService.price} تومان</span>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-100 flex justify-between bg-white">
        {step !== 'SERVICE' && (
          <Button 
            variant="secondary" 
            onClick={() => {
              if (step === 'CONFIRM') setStep('DATETIME');
              else if (step === 'DATETIME') setStep('PROVIDER');
              else if (step === 'PROVIDER') setStep('SERVICE');
            }}
          >
            بازگشت
          </Button>
        )}
        <div className="mr-auto">
           {step === 'DATETIME' && (
             <Button disabled={!selectedSlot} onClick={() => setStep('CONFIRM')}>بررسی نهایی</Button>
           )}
           {step === 'CONFIRM' && (
             <Button onClick={handleConfirm}>تایید و رزرو</Button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Booking;