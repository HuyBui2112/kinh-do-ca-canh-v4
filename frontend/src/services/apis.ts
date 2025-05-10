import axios, { AxiosResponse } from "axios";
import {
    RegisterRequest,
    AuthInfo,
    UpdateProfileRequest,
    ChangePasswordRequest,
    UserResponse,
    AuthResponse,
    ApiResponse,
} from "../utils/types";

// BASE URL cho API
const BASE_URL = `http://localhost:5000/api`;

// Tạo instance cho các API không yêu cầu xác thực
export const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Tạo instance cho các API yêu cầu xác thực
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Thêm interceptor cho instance yêu cầu xác thực
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

// Hàm API
export const apis = {

    // ==========||   Xác thực API   ||========== //

    // Đăng ký tài khoản mới
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await publicAxios.post('/auth/register', data);
        if (response.data.status === 'success' && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    // Đăng nhập tài khoản
    login: async (data: AuthInfo | { info_auth: AuthInfo }): Promise<AuthResponse> => {
        // Hỗ trợ cả hai định dạng được mô tả trong tài liệu API
        const loginData = 'info_auth' in data ? data : { info_auth: data };
        const response: AxiosResponse<AuthResponse> = await publicAxios.post('/auth/login', loginData);
        if (response.data.status === 'success' && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    // Lấy thông tin người dùng
    getUserProfile: async (): Promise<UserResponse> => {
        const response: AxiosResponse<UserResponse> = await privateAxios.get('/users/profile');
        return response.data;
    },
    
    // Cập nhật thông tin người dùng
    updateUserProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
        const response: AxiosResponse<UserResponse> = await privateAxios.patch('/users/profile', data);
        return response.data;
    },

    // Đổi mật khẩu
    changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
        const response: AxiosResponse<ApiResponse<null>> = await privateAxios.patch(
            '/users/change-password', data
        );
        return response.data;
    },

    // ==========||   API Sản phẩm   ||========== //

    // Các API sản phẩm sẽ được thêm sau
}