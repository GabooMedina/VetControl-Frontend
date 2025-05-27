import axios from "axios";

export async function fetchAppointments() {
  const response = await axios.get("https://vet-control-backend.onrender.com/citas");
  return response.data;
}
