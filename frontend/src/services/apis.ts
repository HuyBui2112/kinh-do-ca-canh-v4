import axios, { AxiosResponse } from "axios";
import {
    RegisterRequest,
    AuthInfo,
    UpdateProfileRequest,
    ChangePasswordRequest,
    UserResponse,
    AuthResponse,
    ApiResponse,
    ProductQueryParams,
    ProductListResponse,
    ProductDetailResponse,
    ProductSearchResponse,
    CreateReviewRequest,
    UpdateReviewRequest,
    ReviewResponse,
    ReviewListResponse,
    DeleteReviewResponse,
    ReviewQueryParams
} from "@/utils/types";

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
        const response: AxiosResponse<AuthResponse> = await publicAxios.post('/users/register', data);
        if (response.data.status === 'success' && response.data.data?.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    // Đăng nhập tài khoản
    login: async (data: AuthInfo | { info_auth: AuthInfo }): Promise<AuthResponse> => {
        // Hỗ trợ cả hai định dạng được mô tả trong tài liệu API
        const loginData = 'info_auth' in data ? data : { info_auth: data };
        const response: AxiosResponse<AuthResponse> = await publicAxios.post('/users/login', loginData);
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

    // Lấy danh sách sản phẩm với các tùy chọn lọc và phân trang
    getProducts: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
        const response: AxiosResponse<ProductListResponse> = await publicAxios.get('/products', {
            params
        });
        return response.data;
    },

    // Tìm kiếm sản phẩm theo từ khóa
    searchProducts: async (keyword: string): Promise<ProductSearchResponse> => {
        const response: AxiosResponse<ProductSearchResponse> = await publicAxios.get('/products/search', {
            params: { keyword }
        });
        return response.data;
    },
    
    // Lấy chi tiết một sản phẩm theo ID
    getProductDetail: async (productId: string): Promise<ProductDetailResponse> => {
        const response: AxiosResponse<ProductDetailResponse> = await publicAxios.get(`/products/${productId}`);
        return response.data;
    },

    // ==========||   API Đánh giá   ||========== //

    // Tạo đánh giá mới cho sản phẩm
    createReview: async (data: CreateReviewRequest): Promise<ReviewResponse> => {
        const response: AxiosResponse<ReviewResponse> = await privateAxios.post('/reviews', data);
        return response.data;
    },

    // Cập nhật đánh giá
    updateReview: async (reviewId: string, data: UpdateReviewRequest): Promise<ReviewResponse> => {
        const response: AxiosResponse<ReviewResponse> = await privateAxios.put(`/reviews/${reviewId}`, data);
        return response.data;
    },

    // Xóa đánh giá
    deleteReview: async (reviewId: string): Promise<DeleteReviewResponse> => {
        const response: AxiosResponse<DeleteReviewResponse> = await privateAxios.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    // Lấy danh sách đánh giá của sản phẩm
    getProductReviews: async (productId: string, params?: ReviewQueryParams): Promise<ReviewListResponse> => {
        // Theo tài liệu API, endpoint đúng là: /reviews/products/:productId/reviews
        const response: AxiosResponse<ReviewListResponse> = await publicAxios.get(
            `/reviews/products/${productId}/reviews`,
            { params }
        );
        return response.data;
    }
}