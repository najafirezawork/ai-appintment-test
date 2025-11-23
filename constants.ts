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
    create_account: 'ایجاد حساب کاربری',
    new_here: 'کاربر جدید هستید؟',
    already_account: 'حساب کاربری دارید؟',
    search_doctor: 'جستجو نام پزشک...',
    upcoming_appointments: 'نوبت‌های پیش‌رو',
    no_appointments: 'هیچ نوبتی یافت نشد',
    no_appointments_sub: 'شما هیچ نوبت فعالی ندارید. برای مراقبت از سلامت خود نوبت جدید رزرو کنید.',
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
    // Dashboard Specific
    up_next: 'نوبت بعدی',
    days_left: 'روز باقیمانده',
    filter_all: 'همه',
    filter_confirmed: 'تایید شده',
    online_visit: 'ویزیت آنلاین',
    // Booking Flow
    step_service: 'خدمت',
    step_provider: 'پزشک',
    step_datetime: 'زمان',
    step_confirm: 'تایید',
    ai_assistant: 'دستیار هوشمند',
    ai_placeholder: 'مثلا: درد شدید در ناحیه کمر دارم...',
    search: 'جستجو',
    back: 'بازگشت',
    check_final: 'بررسی نهایی',
    confirm_book: 'تایید و رزرو',
    summary_title: 'خلاصه رزرو',
    summary_service: 'نوع خدمت',
    summary_provider: 'پزشک معالج',
    summary_time: 'تاریخ و زمان',
    summary_cost: 'هزینه نهایی',
    currency: 'تومان',
    available_slots: 'زمان‌های خالی برای',
    // Provider Specific
    provider_stats_patients: 'کل بیماران',
    provider_stats_today: 'نوبت‌های امروز',
    provider_stats_income: 'درآمد ماهانه',
    provider_schedule: 'برنامه امروز',
    provider_next_patient: 'مراجعه‌کننده بعدی',
    patient_details: 'جزئیات پرونده',
    start_visit: 'شروع ویزیت',
    no_visits_today: 'برای امروز نوبتی ندارید.',
    time_label: 'زمان',
    type_label: 'نوع',
    in_person: 'حضوری',
    free_time: 'وقت آزاد!',
    patient_id: 'بیمار شماره',
    // History & New filters
    tab_upcoming: 'پیش‌رو',
    tab_history: 'تاریخچه',
    date_from: 'از تاریخ',
    date_to: 'تا تاریخ',
    filter_completed: 'تکمیل شده',
    filter_cancelled: 'لغو شده',
    no_history: 'تاریخچه‌ای یافت نشد',
    // Confirmation
    cancel_confirm_title: 'لغو نوبت',
    cancel_confirm_message: 'آیا از لغو این نوبت اطمینان دارید؟',
    yes: 'بله',
    no: 'خیر',
  },
  en: {
    app_name: 'Nova Booking',
    dashboard: 'Dashboard',
    booking: 'Book Appointment',
    profile: 'Profile',
    logout: 'Logout',
    welcome: 'Welcome',
    welcome_sub: 'Your health management panel',
    create_account: 'Create your account',
    new_here: 'New here?',
    already_account: 'Already have an account?',
    search_doctor: 'Search doctor name...',
    upcoming_appointments: 'Upcoming Appointments',
    no_appointments: 'No appointments found',
    no_appointments_sub: 'You have no upcoming visits. Book a new appointment to take care of your health.',
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
    // Dashboard Specific
    up_next: 'UP NEXT',
    days_left: 'Days Left',
    filter_all: 'All',
    filter_confirmed: 'Confirmed',
    online_visit: 'Online',
    // Booking Flow
    step_service: 'Service',
    step_provider: 'Doctor',
    step_datetime: 'Date',
    step_confirm: 'Confirm',
    ai_assistant: 'AI Assistant',
    ai_placeholder: 'e.g., I have severe back pain...',
    search: 'Search',
    back: 'Back',
    check_final: 'Review',
    confirm_book: 'Confirm & Book',
    summary_title: 'Booking Summary',
    summary_service: 'Service',
    summary_provider: 'Provider',
    summary_time: 'Date & Time',
    summary_cost: 'Total Cost',
    currency: '$',
    available_slots: 'Available slots for',
    // Provider Specific
    provider_stats_patients: 'Total Patients',
    provider_stats_today: 'Today\'s Visits',
    provider_stats_income: 'Monthly Income',
    provider_schedule: 'Today\'s Schedule',
    provider_next_patient: 'Next Patient',
    patient_details: 'Patient Details',
    start_visit: 'Start Visit',
    no_visits_today: 'No appointments for today.',
    time_label: 'Time',
    type_label: 'Type',
    in_person: 'In-Person',
    free_time: 'Free time!',
    patient_id: 'Patient #',
    // History & New filters
    tab_upcoming: 'Upcoming',
    tab_history: 'History',
    date_from: 'From Date',
    date_to: 'To Date',
    filter_completed: 'Completed',
    filter_cancelled: 'Cancelled',
    no_history: 'No history found',
    // Confirmation
    cancel_confirm_title: 'Cancel Appointment?',
    cancel_confirm_message: 'Are you sure you want to cancel this appointment?',
    yes: 'Yes',
    no: 'No',
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
  },
  {
    id: 'a3',
    userId: 'u1',
    providerId: 'p2',
    serviceId: 's2',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: AppointmentStatus.COMPLETED,
  },
  {
    id: 'a4',
    userId: 'u1',
    providerId: 'p3',
    serviceId: 's5',
    date: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
    status: AppointmentStatus.CANCELLED,
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
