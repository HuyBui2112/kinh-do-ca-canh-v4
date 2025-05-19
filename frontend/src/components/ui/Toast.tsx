"use client";

import { FC, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [visible, setVisible] = useState(true);
  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | undefined;
    let hideTimer: NodeJS.Timeout | undefined;

    if (!actions.length && duration > 0) {
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newWidth = Math.max(0, 100 - (elapsedTime / duration) * 100);
        setProgressWidth(newWidth);
        if (newWidth === 0) {
          clearInterval(progressInterval);
        }
      }, 50);

      hideTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }, duration);
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [duration, actions.length, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case "error":
        return <AlertCircle className="h-6 w-6 text-rose-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "info":
        return <Info className="h-6 w-6 text-sky-500" />;
    }
  };

  const typeColors = {
    success: {
      base: "emerald-500",
      border: "border-emerald-500",
      bgClass: "bg-emerald-500",
    },
    error: {
      base: "rose-500",
      border: "border-rose-500",
      bgClass: "bg-rose-500",
    },
    warning: {
      base: "amber-500",
      border: "border-amber-500",
      bgClass: "bg-amber-500",
    },
    info: {
      base: "sky-500",
      border: "border-sky-500",
      bgClass: "bg-sky-500",
    },
  };

  const currentColor = typeColors[type];

  const portalRoot = typeof window !== "undefined" ? document.body : null;

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed top-5 right-5 z-[9999] w-full max-w-sm rounded-xl bg-white shadow-xl
            overflow-hidden border ${currentColor.border}`}
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300
          }}
        >
          <div className="p-4">
            <div className="flex items-start">
              <motion.div 
                className="flex-shrink-0 pt-0.5"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {getIcon()}
              </motion.div>
              <div className="ml-3.5 w-0 flex-1">
                <motion.p 
                  className="text-base font-semibold text-gray-900"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {type === "success" && "Thành công"}
                  {type === "error" && "Không thành công"}
                  {type === "warning" && "Cảnh báo"}
                  {type === "info" && "Thông báo"}
                </motion.p>
                {message && message !== (type === "success" ? "Thành công" : type === "error" ? "Không thành công" : type === "warning" ? "Cảnh báo" : "Thông báo") && (
                  <motion.p 
                    className="mt-1 text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {message}
                  </motion.p>
                )}

                {actions.length > 0 && (
                  <motion.div 
                    className="mt-4 flex space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {actions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          action.onClick();
                          handleClose();
                        }}
                        className={`text-sm font-medium rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${ 
                          action.variant === "primary"
                            ? `bg-${currentColor.base} text-white hover:bg-opacity-90 focus:ring-${currentColor.base}`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <motion.button
                  onClick={handleClose}
                  className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </div>
          {!actions.length && duration > 0 && (
            <motion.div 
              className="h-1 w-full"
              initial={{ width: "100%" }}
            >
              <motion.div 
                className={`h-full ${currentColor.bgClass}`}
                style={{ width: `${progressWidth}%` }}
                animate={{ width: `${progressWidth}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Toast;
