// Tên người dùng
export interface UserName {
    lastname: string;
    firstname: string;
}

// Thông tin người dùng
export interface UserInfo {
    username: UserName;
    phone: string;
    address: string;
}

// Thông tin xác thực người dùng
export interface AuthInfo {
    email: string;
    password: string;
}

// Request Body cho "Đăng ký"
export interface RegisterRequest {
    info_user: UserInfo,
    info_auth: AuthInfo
}

// Request Body cho "Cập nhật thông tin cá nhân"
export interface UpdateProfileRequest {
    info_user: Partial<UserInfo>;
}

// Request Body cho "Đổi mật khẩu"
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// Cấu trúc phản hồi API chung
export interface ApiResponse<T> {
    status: "success" | "fail";
    message?: string;
    data?: T;
    error?: {
        statusCode: number;
        status: string;
        isOperational: boolean;
    };
}

// Phản hồi API xác thực (đăng ký/đăng nhập)
export interface AuthResponseData {
    email: string;
    info_user: UserInfo;
    token: string;
}

export type AuthResponse = ApiResponse<AuthResponseData>;

// Phản hồi API thông tin người dùng
export interface UserResponseData {
    email: string;
    info_user: UserInfo;
}

export type UserResponse = ApiResponse<UserResponseData>;