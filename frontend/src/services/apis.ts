import axios, { AxiosResponse } from "axios";
import {
    RegisterRequest,
    LoginRequest,
    UpdateProfileRequest,
    ChangePasswordRequest,
    UserResponse,
    AuthResponse,
} from "../utils/types";

// BASE URL for link apis
const BASE_URL = `http://localhost:5000/api/`;


// Create instance for APIs APIs do not require authentication
export const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Create instance for APIs require authentication
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Add interceptor to private instance
privateAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// API Functions
export const apis = {

    // ==========||   Authentication APIs   ||========== //

    // Register new account
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await publicAxios.post('auth/register', data);
        console.log(response.data);
        return response.data;
    },

    // Login an account
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await publicAxios.post('auth/login', data);
        console.log(response.data);
        return response.data;
    },

    // Get user profile
    getUserProfile: async (): Promise<UserResponse> => {
        const response: AxiosResponse<UserResponse> = await privateAxios.get('users/profile');
        console.log(response.data);
        return response.data;
    },
    
    // Update user profile
    updateUserProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
        const response: AxiosResponse<UserResponse> = await privateAxios.put('users/profile', data);
        console.log(response.data);
        return response.data;
    },

    // Change password
    changePassword: async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
        const response: AxiosResponse<{ success: boolean; message: string }> = await privateAxios.put(
            'users/change-password', data
        );
        console.log(response.data);
        return response.data;
    },

    // ==========||   Production APIs   ||========== //

}
