"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apis } from "../services/apis";
import {
  AuthInfo,
  UserInfo,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../utils/types";

// Định nghĩa cấu trúc dữ liệu của người dùng
export interface IUser {
  email: string;
  info_user: UserInfo;
}

// Định nghĩa cấu trúc trạng thái đăng nhập
export interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
}

// Định nghĩa cấu trúc context
interface UserContextType extends AuthState {
  // Các phương thức xác thực
  login: (credentials: AuthInfo) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  clearError: () => void;
}

// Tạo context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props cho UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// Provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Trạng thái đăng nhập ban đầu
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Lấy thông tin người dùng từ API
        const response = await apis.getUserProfile();

        if (response.status === "success" && response.data) {
          setAuthState({
            isAuthenticated: true,
            user: {
              email: response.data.email,
              info_user: response.data.info_user,
            },
            isLoading: false,
            error: null,
          });
        } else {
          // Token không hợp lệ hoặc hết hạn
          localStorage.removeItem("token");
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error: unknown) {
        // Lỗi kết nối hoặc API
        localStorage.removeItem("token");
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Không thể xác thực người dùng",
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Xử lý đăng nhập
  const login = async (credentials: AuthInfo): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apis.login(credentials);

      if (response.status === "success" && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: {
            email: response.data.email,
            info_user: response.data.info_user,
          },
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Đăng nhập thất bại",
        }));
        return false;
      }
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Đăng nhập thất bại",
      }));
      return false;
    }
  };

  // Xử lý đăng ký
  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apis.register(userData);

      if (response.status === "success" && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: {
            email: response.data.email,
            info_user: response.data.info_user,
          },
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Đăng ký thất bại",
        }));
        return false;
      }
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Đăng ký thất bại",
      }));
      return false;
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  };

  // Xử lý cập nhật thông tin người dùng
  const updateProfile = async (
    data: UpdateProfileRequest
  ): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apis.updateUserProfile(data);

      if (response.status === "success" && response.data) {
        setAuthState((prev) => ({
          ...prev,
          user: response.data
            ? {
                email: response.data.email,
                info_user: response.data.info_user,
              }
            : prev.user,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Cập nhật thông tin thất bại",
        }));
        return false;
      }
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Cập nhật thông tin thất bại",
      }));
      return false;
    }
  };

  // Xử lý đổi mật khẩu
  const changePassword = async (
    data: ChangePasswordRequest
  ): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await apis.changePassword(data);

      if (response.status === "success") {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.message || "Đổi mật khẩu thất bại",
        }));
        return false;
      }
    } catch (error: unknown) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Đổi mật khẩu thất bại",
      }));
      return false;
    }
  };

  // Xóa lỗi
  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  // Giá trị của context
  const contextValue: UserContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser phải được sử dụng trong UserProvider");
  }

  return context;
};
