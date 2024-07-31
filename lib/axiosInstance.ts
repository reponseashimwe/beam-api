import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
apiClient.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorObj = error as AxiosError;
    if (errorObj.response?.status === 401) {
      window.location.href = "/sign-in";
    } else {
      const errorData = errorObj.response?.data as Record<string, string>;
      const errorMessage = errorData
        ? errorData.message || errorData.error || errorObj.message
        : "Failed";
      console.log(errorMessage);
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
