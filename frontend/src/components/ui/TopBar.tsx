"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, User, ChevronDown, LogOut } from "lucide-react";
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
          className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-sky-400/30 focus:outline-none transition-colors duration-200"
          aria-expanded={prop.userMenuOpen}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <User size={14} />
          </div>
          <span className="truncate font-medium">
            Xin chào, &nbsp;
            {prop.user?.info_user.username.firstname || "Tài khoản"}
          </span>
          <motion.span
            animate={{ rotate: prop.userMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {prop.userMenuOpen && (
            <motion.div
              className="absolute right-0 top-8 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 z-50 border border-sky-100/80 overflow-hidden"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{
                duration: 0.25,
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              {/* Thông tin người dùng */}
              <motion.div
                className="px-4 py-3 border-b border-sky-100 bg-gradient-to-b from-sky-50 to-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="font-semibold text-sky-800 truncate">
                  {prop.user?.info_user.username.firstname}
                </p>
                <p className="text-xs text-sky-600/80 truncate mt-0.5">
                  {prop.user?.email}
                </p>
              </motion.div>

              {/* Các liên kết tài khoản */}
              <div>
                <Link
                  href="/ca-nhan"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-sky-700 hover:bg-sky-50 transition-colors duration-150"
                  onClick={() => prop.setUserMenuOpen(false)}
                >
                  <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                    <User size={15} />
                  </div>
                  <span>Thông tin cá nhân</span>
                </Link>
              </div>

              <div className="border-t border-sky-100 my-1"></div>

              {/* Đăng xuất */}
              <button
                onClick={() => {
                  prop.handleLogout();
                  showToast("success", "Bạn đã đăng xuất thành công!");
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-150"
              >
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <LogOut size={15} />
                </div>
                <span>Đăng xuất</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  return (
    <div className="hidden lg:block bg-gradient-to-r from-sky-700 via-sky-600 to-sky-700 text-sm text-sky-50 py-1.5 shadow-sm border-b border-sky-700/70">
      <div className="container flex items-center justify-between">
        {/* Contact Info */}
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <Phone size={12} />
            </div>
            <span>0987 654 321</span>
          </motion.div>
          <span className="text-sky-300/50">|</span>
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
              <Mail size={12} />
            </div>
            <span>kinhdocacanh@gmail.com</span>
          </motion.div>
        </div>

        {/* Register/Login Button */}
        <div className="flex items-center gap-3">
          {prop.loading ? (
            // Hiển thị trạng thái đang tải
            <motion.div
              className="px-3 text-sky-100 opacity-75 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-3 h-3 rounded-full border-2 border-sky-100 border-t-transparent animate-spin"></div>
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
              <div>
                <Link
                  href="/dang-nhap"
                  className="px-3 py-1 rounded-md hover:bg-sky-500/40 transition-colors duration-200 flex items-center gap-1.5"
                >
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <span>Đăng nhập</span>
                </Link>
              </div>

              <span className="text-sky-300/50">|</span>

              {/* Register Button */}
              <div>
                <Link
                  href="/dang-ky"
                  className="px-3 py-1 rounded-md hover:bg-sky-500/40 transition-colors duration-200 flex items-center gap-1.5"
                >
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" x2="19" y1="8" y2="14"></line>
                      <line x1="22" x2="16" y1="11" y2="11"></line>
                    </svg>
                  </div>
                  <span>Đăng ký</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
