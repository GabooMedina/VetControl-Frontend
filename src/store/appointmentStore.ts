import { create } from "zustand";

export interface Appointment {
  id: string;
  fecha_hora: string;
  motivo: string;
  estado: string;
  usuarioId: { id: string };
  mascotaId: { id: string };
}

interface AppointmentStore {
  appointments: Appointment[];
  setAppointments: (apps: Appointment[]) => void;
  addAppointment: (a: Omit<Appointment, "id">) => void;
  editAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  setAppointments: (apps) => set({ appointments: apps }),
  addAppointment: (a) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        { ...a, id: String(Date.now()) },
      ],
    })),
  editAppointment: (id, data) =>
    set((state) => ({
      appointments: state.appointments.map((app) =>
        app.id === id ? { ...app, ...data } : app
      ),
    })),
  deleteAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.filter((a) => a.id !== id),
    })),
}));