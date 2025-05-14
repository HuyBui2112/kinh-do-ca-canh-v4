"use client";

import { FC, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
  }[];
}

/**
 * Component Toast hiển thị thông báo popup
 */
const Toast: FC<ToastProps> = ({
  type,
  message,
  duration = 2000,
  onClose,
  actions = [],
}) => {
  const [visible, setVisible] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 10);
    
    if (!actions.length && duration > 0) {
      const hideTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    
    return () => clearTimeout(showTimer);
  }, [duration, actions.length]);

  const handleClose = () => {
    setRemoving(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 100);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  const portalRoot = typeof window !== "undefined" ? document.body : null;

  if (!portalRoot) return null;

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-md
        transition-all duration-300 transform
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${removing ? 'translate-x-full opacity-0' : ''}
        ${getBgColor()}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
          
          {actions.length > 0 && (
            <div className="mt-3 flex space-x-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    handleClose();
                  }}
                  className={`text-sm font-medium rounded-md px-3 py-1.5 ${
                    action.variant === "primary"
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleClose}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    portalRoot
  );
};

export default Toast; 