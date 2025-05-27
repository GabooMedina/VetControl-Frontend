import axios from "axios";
const API_URL: string = import.meta.env.VITE_BASE_URL;

export async function fetchAppointments() {
  const response = await axios.get(`${API_URL}/citas`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}

export async function createAppointment(appointmentData: any) {
  const response = await axios.post(`${API_URL}/citas`, appointmentData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}
