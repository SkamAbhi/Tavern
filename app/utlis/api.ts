// utils/api.ts
import axios from "axios";

// Create typed axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add proper TypeScript types for the interceptor
api.interceptors.request.use((config) => {
  // Server-side guard
  if (typeof window === "undefined") return config;

  // Client-side token handling
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;