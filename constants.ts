import { Provider, Service, User, UserRole, Appointment, AppointmentStatus } from './types';

export const TRANSLATIONS = {
  fa: {
    app_name: 'نوبت‌دهی نوا',
    dashboard: 'داشبورد',
    booking: 'رزرو نوبت',
    profile: 'پروفایل',
    logout: 'خروج',
    welcome: 'خوش آمدید',
    welcome_sub: 'پنل مدیریت سلامت شما',
    search_doctor: 'جستجو نام پزشک...',
    upcoming_appointments: 'نوبت‌های پیش‌رو',
    no_appointments: 'هیچ نوبتی یافت نشد',
    book_new: 'رزرو نوبت جدید',
    history: 'تاریخچه',
    cancel: 'لغو نوبت',
    reschedule: 'تغییر زمان',
    status_confirmed: 'تایید شده',
    status_pending: 'در انتظار',
    status_cancelled: 'لغو شده',
    status_completed: 'انجام شده',
    stats_pending: 'در انتظار',
    stats_history: 'تاریخچه',
    stats_rating: 'امتیاز',
    role_patient: 'بیمار',
    role_provider: 'پزشک',
    login_as: 'ورود به عنوان',
    login_btn: 'ورود',
    register_btn: 'ثبت نام',
    email: 'آدرس ایمیل',
    password: 'کلمه عبور',
    name: 'نام و نام خانوادگی',
    // Provider Specific
    provider_stats_patients: 'کل بیماران',
    provider_stats_today: 'نوبت‌های امروز',
    provider_stats_income: 'درآمد ماهانه',
    provider_schedule: 'برنامه امروز',
    provider_next_patient: 'مراجعه‌کننده بعدی',
    patient_details: 'جزئیات پرونده',
    start_visit: 'شروع ویزیت',
  },
  en: {
    app_name: 'Nova Booking',
    dashboard: 'Dashboard',
    booking: 'Book Appointment',
    profile: 'Profile',
    logout: 'Logout',
    welcome: 'Welcome',
    welcome_sub: 'Your health management panel',
    search_doctor: 'Search doctor name...',
    upcoming_appointments: 'Upcoming Appointments',
    no_appointments: 'No appointments found',
    book_new: 'Book New',
    history: 'History',
    cancel: 'Cancel',
    reschedule: 'Reschedule',
    status_confirmed: 'Confirmed',
    status_pending: 'Pending',
    status_cancelled: 'Cancelled',
    status_completed: 'Completed',
    stats_pending: 'Pending',
    stats_history: 'History',
    stats_rating: 'Rating',
    role_patient: 'Patient',
    role_provider: 'Doctor',
    login_as: 'Login as',
    login_btn: 'Login',
    register_btn: 'Register',
    email: 'Email Address',
    password: 'Password',
    name: 'Full Name',
    // Provider Specific
    provider_stats_patients: 'Total Patients',
    provider_stats_today: 'Today\'s Visits',
    provider_stats_income: 'Monthly Income',
    provider_schedule: 'Today\'s Schedule',
    provider_next_patient: 'Next Patient',
    patient_details: 'Patient Details',
    start_visit: 'Start Visit',
  }
};

export const MOCK_USER_PATIENT: User = {
  id: 'u1',
  name: 'Ali Mohammadi',
  email: 'ali@example.com',
  role: UserRole.PATIENT,
  avatarUrl: 'https://picsum.photos/200/200?random=99',
};

export const MOCK_USER_PROVIDER: User = {
  id: 'p1',
  name: 'Dr. Sarah Rezai',
  email: 'sarah@hospital.com',
  role: UserRole.PROVIDER,
  avatarUrl: 'https://picsum.photos/200/200?random=1',
};

export const SERVICES: Service[] = [
  { id: 's1', name: 'General Consultation', description: 'General health checkup.', duration: 30, price: 50, category: 'General', icon: 'fa-user-doctor' },
  { id: 's2', name: 'Dental Cleaning', description: 'Professional teeth cleaning.', duration: 45, price: 80, category: 'Dental', icon: 'fa-tooth' },
  { id: 's3', name: 'Cardiology Checkup', description: 'Heart health evaluation.', duration: 60, price: 150, category: 'Specialist', icon: 'fa-heart-pulse' },
  { id: 's4', name: 'Eye Exam', description: 'Comprehensive vision test.', duration: 30, price: 60, category: 'Vision', icon: 'fa-eye' },
  { id: 's5', name: 'Physiotherapy', description: 'Physical therapy session.', duration: 45, price: 90, category: 'Therapy', icon: 'fa-person-running' },
];

export const PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Dr. Sarah Rezai',
    specialty: 'Cardiologist',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/200/200?random=1',
    services: ['s1', 's3'],
    availableSlots: [],
    bio: 'Specialist in cardiovascular health with 15 years of experience.'
  },
  {
    id: 'p2',
    name: 'Dr. John Doe',
    specialty: 'Dentist',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/200/200?random=2',
    services: ['s2'],
    availableSlots: [],
    bio: 'Gentle dental care for the whole family.'
  },
  {
    id: 'p3',
    name: 'Dr. Maryam Ahmadi',
    specialty: 'General Practitioner',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/200/200?random=3',
    services: ['s1', 's5'],
    availableSlots: [],
    bio: 'Holistic approach to general medicine and wellness.'
  },
];

// Generate some initial mock appointments
export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    userId: 'u1',
    providerId: 'p1',
    serviceId: 's3',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: AppointmentStatus.CONFIRMED,
  },
  {
    id: 'a2',
    userId: 'u2',
    providerId: 'p1',
    serviceId: 's1',
    date: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    status: AppointmentStatus.CONFIRMED,
  }
];

export const generateSlots = (): string[] => {
  const slots: string[] = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    [9, 14, 16].forEach(hour => {
      day.setHours(hour, 0, 0, 0);
      slots.push(day.toISOString());
    });
  }
  return slots;
};

PROVIDERS.forEach(p => p.availableSlots = generateSlots());