import axios from "axios";
const API_URL: string = import.meta.env.VITE_BASE_URL;

export const getUsuarios = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/usuarios`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
