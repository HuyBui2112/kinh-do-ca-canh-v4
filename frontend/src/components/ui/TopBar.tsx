"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  User,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { IUser } from "@/contexts/UserContext";
import { useToast } from "@/contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

interface PropType {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userMenuRef: React.RefObject<HTMLDivElement | null>;
  toggleUserMenu: () => void;
  userMenuOpen: boolean;
  setUserMenuOpen: (value: boolean) => void;
  handleLogout: () => void;
}

export default function TopBar(prop: PropType) {
  const { showToast } = useToast();

  // Render user dropdown menu
  const _renderUserDropdown = () => {
    return (
      <div className="relative" ref={prop.userMenuRef}>
        <motion.button
          onClick={prop.toggleUserMenu}
          className="flex items-center gap-2 px-2 rounded-md hover:bg-sky-400 focus:outline-none"
          aria-expanded={prop.userMenuOpen}
          whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.2)" }}
          whileTap={{ scale: 0.98 }}
        >
          <User size={16} />
          <span className="truncate">
            Xin chào, &nbsp;
            {prop.user?.info_user.username.firstname || "Tài khoản"}
          </span>
          <motion.span
            animate={{ rotate: prop.userMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {prop.userMenuOpen && (
            <motion.div 
              className="absolute right-0 top-8 mt-1 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Thông tin người dùng */}
              <motion.div 
                className="px-4 py-2 border-b border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="font-medium text-sky-950 truncate">
                  {prop.user?.info_user.username.firstname}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {prop.user?.email}
                </p>
              </motion.div>

              {/* Các liên kết tài khoản */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/ca-nhan"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
                  onClick={() => prop.setUserMenuOpen(false)}
                >
                  <User size={16} />
                  <span>Thông tin cá nhân</span>
                </Link>
              </motion.div>

              <div className="border-t border-gray-100 my-1"></div>

              {/* Đăng xuất */}
              <motion.button
                onClick={() => {
                  prop.handleLogout();
                  showToast("success", "Bạn đã đăng xuất thành công!");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ backgroundColor: 'rgba(254, 202, 202, 0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  return (
    <div className="hidden lg:block bg-sky-600 text-sm text-sky-100 py-1">
      <div className="container flex items-center justify-between">
        {/* Contact Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>0987 654 321</span>
          </div>
          <span>|</span>
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>kinhdocacanh@gmail.com</span>
          </div>
        </div>

        {/* Register/Login Button */}
        <div className="flex items-center gap-2">
          {prop.loading ? (
            // Hiển thị trạng thái đang tải
            <motion.div 
              className="px-2 text-sky-100 opacity-75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.3 }}
            >
              Đang tải...
            </motion.div>
          ) : prop.isAuthenticated && prop.user ? (
            <>
              {/* User Dropdown Menu */}
              {_renderUserDropdown()}
            </>
          ) : (
            <>
              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/dang-nhap"
                  className="px-2 rounded-md hover:bg-sky-400"
                >
                  Đăng nhập
                </Link>
              </motion.div>

              <span>|</span>

              {/* Register Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/dang-ky"
                  className="px-2 rounded-md hover:bg-sky-400"
                >
                  Đăng ký
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
