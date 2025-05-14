"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast, { ToastProps, ToastType } from "@/components/ui/Toast";

interface ToastItem extends ToastProps {
  id: string;
}

interface ToastContextProps {
  showToast: (
    type: ToastType,
    message: string,
    options?: Omit<ToastProps, "type" | "message">
  ) => string;
  hideToast: (id: string) => void;
  confirmAction: (
    message: string,
    onConfirm: () => void,
    options?: {
      type?: ToastType;
      confirmLabel?: string;
      cancelLabel?: string;
      duration?: number;
    }
  ) => string;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => "",
  hideToast: () => {},
  confirmAction: () => "",
});

export const useToast = () => useContext(ToastContext);

/**
 * Provider để quản lý toasts trong ứng dụng
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Hiển thị toast mới
  const showToast = (
    type: ToastType,
    message: string,
    options?: Omit<ToastProps, "type" | "message">
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => [
      ...prev,
      {
        id,
        type,
        message,
        ...options,
      },
    ]);
    
    return id;
  };

  // Ẩn toast
  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Hiển thị toast xác nhận hành động
  const confirmAction = (
    message: string,
    onConfirm: () => void,
    options?: {
      type?: ToastType;
      confirmLabel?: string;
      cancelLabel?: string;
      duration?: number;
    }
  ) => {
    const type = options?.type || "warning";
    const confirmLabel = options?.confirmLabel || "Xác nhận";
    const cancelLabel = options?.cancelLabel || "Hủy";
    const duration = options?.duration || 10000; // Mặc định tự động đóng sau 10 giây
    
    return showToast(type, message, {
      duration: duration, // Thời gian tự động đóng
      actions: [
        {
          label: confirmLabel,
          onClick: onConfirm,
          variant: "primary",
        },
        {
          label: cancelLabel,
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, confirmAction }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          actions={toast.actions}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider; 