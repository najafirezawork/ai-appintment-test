export enum UserRole {
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  icon: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  imageUrl: string;
  services: string[]; // Service IDs
  availableSlots: string[]; // ISO Date strings
  bio: string;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string; // ISO string
  status: AppointmentStatus;
  notes?: string;
}

export type ViewState = 'AUTH' | 'DASHBOARD' | 'BOOKING' | 'PROFILE';

export interface AppState {
  user: User | null;
  currentView: ViewState;
  appointments: Appointment[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}