// src/services/authApi.ts
// src/types/auth.ts

export interface User {
    id: string;
    username: string;
    email: string;
    currentRoom: string;
    position: {
      x: number;
      y: number;
    };
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface ProfileResponse {
    user: User;
  }
  
  export interface UpdateProfileData {
    username?: string;
    email?: string;
  }

import axios, { AxiosInstance } from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const authApi: AxiosInstance = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
authApi.interceptors.request.use(
  (config: { headers: { Authorization: string; }; }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.post<AuthResponse>('/login', { email, password });
    
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error: unknown) {
    if ((error as any).isAxiosError && error.response) {
      throw error.response.data?.error || 'Login failed';
    }
    throw 'Login failed';
  }
};

export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await authApi.post<AuthResponse>('/signup', userData);
    
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    if ((error as any).isAxiosError && error.response) {
      throw error.response.data?.error || 'Registration failed';
    }
    throw 'Registration failed';
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authApi.post('/logout');
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Logout error:', error);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await authApi.get<ProfileResponse>('/me');
    return response.data;
  } catch (error) {
    if ((error as any).isAxiosError && error.response) {
      throw error.response.data?.error || 'Failed to fetch profile';
    }
    throw 'Failed to fetch profile';
  }
};

export const updateProfile = async (profileData: UpdateProfileData): Promise<ProfileResponse> => {
  try {
    const response = await authApi.put<ProfileResponse>('/profile', profileData);
    return response.data;
  } catch (error) {
    if ((error as any).isAxiosError && error.response) {
      throw error.response.data?.error || 'Failed to update profile';
    }
    throw 'Failed to update profile';
  }
};

export default {
  login,
  signup,
  logout,
  getProfile,
  updateProfile
};