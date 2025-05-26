import axios, { AxiosResponse } from "axios";
import {
  AuthInfo,
  UserResponse,
  AuthResponse,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/utils/types/auth";
import {
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
    ReviewQueryParams,
    CartApiResponse,
    AddToCartRequest,
    UpdateCartItemRequest,
    UpdateCartRequest,
    ClearCartApiResponse,
    CreateOrderRequest,
    OrderApiResponse,
    OrderListApiResponse,
    CancelOrderApiResponse,
    BuyNowOrderRequest,
    BlogQueryParams,
    BlogListResponse,
    BlogDetailResponse
} from "@/utils/types";

// BASE URL cho API
// const BASE_URL = `https://kinhdocacanh-backend.onrender.com/api/v1/`;
const BASE_URL = `http://localhost:5000/api/v1/`;

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
        const response: AxiosResponse<ReviewListResponse> = await publicAxios.get(
            `/reviews/products/${productId}/reviews`,
            { params }
        );
        return response.data;
    },

    // ==========||   API Giỏ hàng (Cart)   ||========== //

    /**
     * Lấy thông tin giỏ hàng của người dùng hiện tại.
     * @returns {Promise<CartApiResponse>} Thông tin giỏ hàng.
     */
    getCart: async (): Promise<CartApiResponse> => {
        const response: AxiosResponse<CartApiResponse> = await privateAxios.get('/cart');
        return response.data;
    },

    /**
     * Thêm sản phẩm vào giỏ hàng.
     * @param {AddToCartRequest} data - Dữ liệu sản phẩm và số lượng.
     * @returns {Promise<CartApiResponse>} Giỏ hàng sau khi thêm.
     */
    addItemToCart: async (data: AddToCartRequest): Promise<CartApiResponse> => {
        const response: AxiosResponse<CartApiResponse> = await privateAxios.post('/cart/items', data);
        return response.data;
    },

    /**
     * Cập nhật toàn bộ giỏ hàng với danh sách sản phẩm mới.
     * @param {UpdateCartRequest} data - Danh sách sản phẩm mới cho giỏ hàng.
     * @returns {Promise<CartApiResponse>} Giỏ hàng sau khi cập nhật.
     */
    updateCart: async (data: UpdateCartRequest): Promise<CartApiResponse> => {
        const response: AxiosResponse<CartApiResponse> = await privateAxios.put('/cart', data);
        return response.data;
    },

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng.
     * @param {string} productId - ID của sản phẩm cần cập nhật.
     * @param {UpdateCartItemRequest} data - Số lượng mới.
     * @returns {Promise<CartApiResponse>} Giỏ hàng sau khi cập nhật.
     */
    updateCartItem: async (productId: string, data: UpdateCartItemRequest): Promise<CartApiResponse> => {
        const response: AxiosResponse<CartApiResponse> = await privateAxios.put(`/cart/items/${productId}`, data);
        return response.data;
    },

    /**
     * Xóa một sản phẩm khỏi giỏ hàng.
     * @param {string} productId - ID của sản phẩm cần xóa.
     * @returns {Promise<CartApiResponse>} Giỏ hàng sau khi xóa.
     */
    removeCartItem: async (productId: string): Promise<CartApiResponse> => {
        const response: AxiosResponse<CartApiResponse> = await privateAxios.delete(`/cart/items/${productId}`);
        return response.data;
    },

    /**
     * Xóa toàn bộ sản phẩm trong giỏ hàng.
     * @returns {Promise<ClearCartApiResponse>} Thông báo và có thể là giỏ hàng rỗng.
     */
    clearCart: async (): Promise<ClearCartApiResponse> => {
        const response: AxiosResponse<ClearCartApiResponse> = await privateAxios.delete('/cart');
        return response.data;
    },

    // ==========||   API Đơn hàng (Order)   ||========== //

    /**
     * Tạo một đơn hàng mới.
     * @param {CreateOrderRequest} data - Thông tin giao hàng và phương thức thanh toán.
     * @returns {Promise<OrderApiResponse>} Đơn hàng đã tạo.
     */
    createOrder: async (data: CreateOrderRequest): Promise<OrderApiResponse> => {
        const response: AxiosResponse<OrderApiResponse> = await privateAxios.post('/orders', data);
        return response.data;
    },

    /**
     * Tạo đơn hàng mua ngay từ một sản phẩm cụ thể.
     * @param {BuyNowOrderRequest} data - Thông tin giao hàng, phương thức thanh toán, ID sản phẩm và số lượng.
     * @returns {Promise<OrderApiResponse>} Đơn hàng đã tạo.
     */
    createBuyNowOrder: async (data: BuyNowOrderRequest): Promise<OrderApiResponse> => {
        const response: AxiosResponse<OrderApiResponse> = await privateAxios.post('/orders/buy-now', data);
        return response.data;
    },

    /**
     * Lấy danh sách đơn hàng của người dùng hiện tại.
     * @returns {Promise<OrderListApiResponse>} Danh sách đơn hàng.
     */
    getMyOrders: async (): Promise<OrderListApiResponse> => {
        const response: AxiosResponse<OrderListApiResponse> = await privateAxios.get('/orders/my-orders');
        return response.data;
    },

    /**
     * Lấy chi tiết một đơn hàng theo ID.
     * @param {string} orderId - ID của đơn hàng.
     * @returns {Promise<OrderApiResponse>} Chi tiết đơn hàng.
     */
    getOrderDetails: async (orderId: string): Promise<OrderApiResponse> => {
        const response: AxiosResponse<OrderApiResponse> = await privateAxios.get(`/orders/${orderId}`);
        return response.data;
    },

    /**
     * Hủy một đơn hàng.
     * @param {string} orderId - ID của đơn hàng cần hủy.
     * @returns {Promise<CancelOrderApiResponse>} Đơn hàng sau khi hủy (đã cập nhật trạng thái).
     */
    cancelOrder: async (orderId: string): Promise<CancelOrderApiResponse> => {
        const response: AxiosResponse<CancelOrderApiResponse> = await privateAxios.put(`/orders/${orderId}/cancel`);
        return response.data;
    },

    // ==========||   API Blog   ||========== //

    /**
     * Lấy danh sách bài viết blog với phân trang và bộ lọc
     * @param {BlogQueryParams} params - Các tham số lọc và phân trang
     * @returns {Promise<BlogListResponse>} Danh sách bài viết blog
     */
    getBlogs: async (params?: BlogQueryParams): Promise<BlogListResponse> => {
        // Xử lý tags nếu là mảng, chuyển thành chuỗi phân cách bằng dấu phẩy
        const queryParams = { ...params };
        if (params?.tags && Array.isArray(params.tags)) {
            queryParams.tags = params.tags.join(',');
        }
        
        const response: AxiosResponse<BlogListResponse> = await publicAxios.get('/blogs', {
            params: queryParams
        });
        return response.data;
    },

    /**
     * Lấy chi tiết bài viết blog theo slug
     * @param {string} slug - Slug của bài viết
     * @returns {Promise<BlogDetailResponse>} Chi tiết bài viết
     */
    getBlogBySlug: async (slug: string): Promise<BlogDetailResponse> => {
        const response: AxiosResponse<BlogDetailResponse> = await publicAxios.get(`/blogs/${slug}`);
        return response.data;
    },
}