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
    step_service: 'انتخاب خدمت',
    step_provider: 'انتخاب پزشک',
    step_datetime: 'زمان رزرو',
    step_confirm: 'تایید نهایی',
    ai_assistant: 'دستیار هوشمند سلامت',
    ai_title: 'چطور می‌توانیم به شما کمک کنیم؟',
    ai_subtitle: 'علائم خود را بنویسید تا بهترین متخصص را پیشنهاد دهیم (مثلا: سردرد شدید دارم)',
    ai_placeholder: 'مثلا: درد شدید در ناحیه کمر دارم...',
    search: 'جستجو',
    back: 'مرحله قبل',
    check_final: 'بررسی نهایی',
    confirm_book: 'تایید و پرداخت',
    summary_title: 'فیش رزرو',
    summary_service: 'خدمت انتخابی',
    summary_provider: 'پزشک متخصص',
    summary_time: 'زمان مراجعه',
    summary_cost: 'مبلغ قابل پرداخت',
    summary_empty_provider: 'هنوز پزشکی انتخاب نشده',
    summary_empty_time: 'زمان انتخاب نشده',
    currency: 'تومان',
    available_slots: 'نوبت‌های خالی',
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
    // Profile
    edit_profile: 'ویرایش پروفایل',
    save_changes: 'ذخیره تغییرات',
    cancel_edit: 'انصراف',
    phone_number: 'شماره تماس',
    location: 'موقعیت مکانی',
    bio: 'درباره من',
    specialty: 'تخصص',
    experience: 'سابقه کار',
    medical_history: 'سوابق پزشکی',
    insurance_provider: 'بیمه تکمیلی',
    emergency_contact: 'تماس اضطراری',
    years: 'سال',
    // Search & Filter
    sort_by: 'مرتب‌سازی',
    sort_rating: 'بالاترین امتیاز',
    sort_default: 'پیش‌فرض',
    filter_available_today: 'فقط امروز',
    no_results_found: 'پزشکی یافت نشد',
    pagination_next: 'بعدی',
    pagination_prev: 'قبلی',
    page: 'صفحه',
    // Time Grouping
    morning: 'صبح',
    afternoon: 'ظهر و عصر',
    evening: 'شب',
    select_provider_btn: 'انتخاب پزشک',
    change: 'تغییر',
    // Auth Social
    or_continue: 'یا ادامه دهید با',
    google: 'گوگل',
    facebook: 'فیس‌بوک',
    apple: 'اپل',
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
    step_service: 'Select Service',
    step_provider: 'Select Doctor',
    step_datetime: 'Date & Time',
    step_confirm: 'Confirmation',
    ai_assistant: 'AI Health Assistant',
    ai_title: 'How can we help you?',
    ai_subtitle: 'Describe your symptoms and we will recommend the best specialist.',
    ai_placeholder: 'e.g., I have severe back pain...',
    search: 'Search',
    back: 'Go Back',
    check_final: 'Review',
    confirm_book: 'Confirm & Pay',
    summary_title: 'Booking Slip',
    summary_service: 'Service',
    summary_provider: 'Specialist',
    summary_time: 'Time',
    summary_cost: 'Total',
    summary_empty_provider: 'No doctor selected',
    summary_empty_time: 'No time selected',
    currency: '$',
    available_slots: 'Available slots',
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
    // Profile
    edit_profile: 'Edit Profile',
    save_changes: 'Save Changes',
    cancel_edit: 'Cancel',
    phone_number: 'Phone Number',
    location: 'Location',
    bio: 'Biography',
    specialty: 'Specialty',
    experience: 'Experience',
    medical_history: 'Medical History',
    insurance_provider: 'Insurance Provider',
    emergency_contact: 'Emergency Contact',
    years: 'Years',
    // Search & Filter
    sort_by: 'Sort By',
    sort_rating: 'Highest Rating',
    sort_default: 'Default',
    filter_available_today: 'Available Today',
    no_results_found: 'No doctors found',
    pagination_next: 'Next',
    pagination_prev: 'Prev',
    page: 'Page',
    // Time Grouping
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    select_provider_btn: 'Select Doctor',
    change: 'Change',
    // Auth Social
    or_continue: 'Or continue with',
    google: 'Google',
    facebook: 'Facebook',
    apple: 'Apple',
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
  {
    id: 'p4',
    name: 'Dr. Kaveh Tehrani',
    specialty: 'Neurologist',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/200/200?random=4',
    services: ['s1'],
    availableSlots: [],
    bio: 'Expert in nervous system disorders.'
  },
  {
    id: 'p5',
    name: 'Dr. Elena Rostami',
    specialty: 'Dermatologist',
    rating: 4.6,
    imageUrl: 'https://picsum.photos/200/200?random=5',
    services: ['s1'],
    availableSlots: [],
    bio: 'Skin care specialist focusing on cosmetic procedures.'
  },
  {
    id: 'p6',
    name: 'Dr. Reza Alavi',
    specialty: 'Orthopedic',
    rating: 4.5,
    imageUrl: 'https://picsum.photos/200/200?random=6',
    services: ['s5'],
    availableSlots: [],
    bio: 'Specializes in bone and joint surgeries.'
  },
  {
    id: 'p7',
    name: 'Dr. Nasim Farhadi',
    specialty: 'Pediatrician',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/200/200?random=7',
    services: ['s1'],
    availableSlots: [],
    bio: 'Dedicated to the health and well-being of children.'
  }
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
  for (let i = 0; i <= 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    // Add various times for grouping test
    [9, 10, 11, 14, 15, 17, 18, 19].forEach(hour => {
      day.setHours(hour, 0, 0, 0);
      slots.push(day.toISOString());
    });
  }
  return slots;
};

PROVIDERS.forEach(p => p.availableSlots = generateSlots());