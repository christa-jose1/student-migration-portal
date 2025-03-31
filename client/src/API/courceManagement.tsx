import axios from "axios"
import { API_BASE_URL } from "../components/Config";

export const LIST_COURCE_API = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error; 
    }
  };