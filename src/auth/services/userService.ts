import axios from "axios";
import { User } from "../../Interfaces/User";

const API_URL: string = import.meta.env.VITE_BASE_URL;
export async function getUserById(userId: number): Promise<User> {
  const response = await axios.get(`${API_URL}/usuarios/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}