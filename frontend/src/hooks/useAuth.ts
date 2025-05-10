"use client";

import { useUser } from '../contexts/UserContext';

/**
 * Hook cung cấp các chức năng xác thực và quản lý người dùng
 * @returns Các phương thức và trạng thái xác thực người dùng
 */
export const useAuth = () => {
  const userContext = useUser();
  
  return {
    // Trạng thái người dùng
    isAuthenticated: userContext.isAuthenticated,
    user: userContext.user,
    isLoading: userContext.isLoading,
    error: userContext.error,
    
    // Các phương thức xác thực
    login: userContext.login,
    register: userContext.register,
    logout: userContext.logout,
    updateProfile: userContext.updateProfile,
    changePassword: userContext.changePassword,
    clearError: userContext.clearError
  };
}; 