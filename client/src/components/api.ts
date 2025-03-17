import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update with your backend URL

// Register user in MongoDB after Firebase signup
export const registerUserInDB = async (uid: string, fullName: string, email: string) => {
  return await axios.post(`${API_URL}/signup`, { uid, fullName, email });
};

