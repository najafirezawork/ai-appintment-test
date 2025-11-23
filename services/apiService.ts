import { User, UserRole, Appointment, Service, Provider, AppointmentStatus } from '../types';
import { MOCK_USER_PATIENT, MOCK_USER_PROVIDER, SERVICES, PROVIDERS, INITIAL_APPOINTMENTS } from '../constants';

// Simulating a database in memory
let users = [MOCK_USER_PATIENT, MOCK_USER_PROVIDER];
let appointments = [...INITIAL_APPOINTMENTS];
const services = [...SERVICES];
const providers = [...PROVIDERS];

const DELAY = 800; // Simulated network latency

export const apiService = {
  login: async (role: UserRole): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = role === UserRole.PATIENT ? users[0] : users[1];
        resolve(user);
      }, DELAY);
    });
  },

  getServices: async (): Promise<Service[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(services), DELAY));
  },

  getProviders: async (): Promise<Provider[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(providers), DELAY));
  },

  getAppointments: async (userId: string): Promise<Appointment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple filter to simulate backend query
        const userAppointments = appointments.filter(a => a.userId === userId || a.providerId === userId);
        resolve(userAppointments);
      }, DELAY);
    });
  },

  createAppointment: async (appointment: Appointment): Promise<Appointment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        appointments.push(appointment);
        resolve(appointment);
      }, DELAY);
    });
  },

  cancelAppointment: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        appointments = appointments.map(a => a.id === id ? { ...a, status: AppointmentStatus.CANCELLED } : a);
        resolve();
      }, DELAY);
    });
  },

  updateUser: async (user: User): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        users = users.map(u => u.id === user.id ? user : u);
        resolve(user);
      }, DELAY);
    });
  }
};