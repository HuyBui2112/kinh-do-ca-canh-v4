"use client";

import React from "react";
import Link from "next/link";
import { NavigationType } from "../layout/Header";
import { IUser } from "@/contexts/UserContext";
import {
  X,
  User,
  Phone,
  Mail,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  handleLogout: () => void;
  isAuthenticated: boolean;
  user: IUser | null;
  navigation: NavigationType[];
  isNavActive: (href: string) => boolean;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  itemCount: number;
}

export default function MobileNavigation(props: MobileNavigationProps) {
  // Render search bar
  const _renderSearchBar = () => {
    return (
      <form
        onSubmit={props.handleSearch}
        className="flex items-center w-full text-sm rounded-md overflow-hidden shadow-sm"
      >
        <motion.input
          type="text"
          placeholder="Bạn muốn tìm gì..."
          value={props.searchKeyword}
          onChange={(e) => props.setSearchKeyword(e.target.value)}
          className="w-full px-4 py-2.5 text-md text-sky-950 border border-r-0 border-sky-600/20 rounded-l-md focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
          whileFocus={{ scale: 1.01 }}
        />
        <motion.button
          type="submit"
          className="flex items-center justify-center min-w-[50px] h-[42px] border border-sky-600 rounded-r-md bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-white hover:to-white hover:text-sky-600 hover:border-sky-600 transition-colors duration-300"
          aria-label="Tìm kiếm"
          whileTap={{ scale: 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </motion.button>
      </form>
    );
  };

  return (
    <>
      <AnimatePresence>
        {props.mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={props.toggleMobileMenu}
          ></motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 border-l border-sky-100"
        initial={{ x: "100%" }}
        animate={{ x: props.mobileMenuOpen ? 0 : "100%" }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.3 
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header with close button */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-sky-50 to-white border-b border-b-blue-950/10">
            <span className="font-semibold text-sky-800 text-lg">Menu</span>
            <motion.button
              onClick={props.toggleMobileMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 transition-colors"
              aria-label="Đóng menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: -90 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Search bar in mobile view (only visible at <md screens) */}
          <div className="px-5 py-4 border-b border-b-blue-950/10 md:hidden">
            {_renderSearchBar()}
          </div>

          {/* Mobile navigation */}
          <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent">
            <nav className="py-2">
              {props.navigation.map((item, index) => {
                const isItemActive = props.isNavActive(item.href);
                return (
                  <motion.div key={item.id} 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={props.toggleMobileMenu}
                      className={`block px-5 py-3 text-sm font-medium hover:bg-sky-50 transition-colors duration-200 ${
                        isItemActive
                          ? "text-sky-600 border-l-4 border-sky-500 bg-sky-50/70"
                          : "text-sky-800 border-l-4 border-transparent"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Thêm các liên kết tài khoản nếu đã đăng nhập */}
              {props.isAuthenticated && props.user && (
                <motion.div 
                  className="border-t border-t-blue-950/10 mt-2 pt-2 mx-2 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <p className="px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-50/50 rounded-t-lg">
                    Tài khoản của bạn
                  </p>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/ca-nhan"
                      onClick={props.toggleMobileMenu}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-medium hover:bg-sky-50 text-sky-800 transition-colors duration-150"
                    >
                      <User size={16} className="text-sky-600" />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/gio-hang"
                      onClick={props.toggleMobileMenu}
                      className="flex items-center gap-2 px-5 py-3 text-sm font-medium hover:bg-sky-50 text-sky-800 transition-colors duration-150 rounded-b-lg"
                    >
                      <ShoppingCart size={16} className="text-sky-600" />
                      <span className="flex-1">Giỏ hàng của tôi</span>
                      {props.itemCount > 0 && (
                        <motion.span 
                          className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {props.itemCount}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </nav>
          </div>

          {/* Mobile top bar elements */}
          <div className="border-t border-t-blue-950/10 bg-gradient-to-b from-white to-sky-50/30">
            <div className="p-5 space-y-3 text-sm">
              {/* Contact info */}
              <div className="flex items-center gap-2 text-sky-700">
                <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center">
                  <Phone size={14} />
                </div>
                <span>0987 654 321</span>
              </div>
              <div className="flex items-center gap-2 text-sky-700">
                <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center">
                  <Mail size={14} />
                </div>
                <span>kinhdocacanh@gmail.com</span>
              </div>

              {/* Authentication links */}
              <div className="flex items-center gap-3 pt-3">
                {props.isAuthenticated && props.user ? (
                  <>
                    <p className="flex-1 text-sky-800 font-medium py-2 px-3 bg-sky-50/80 rounded-md truncate">
                      Xin chào, {props.user.info_user.username.firstname || "Quý khách"}
                    </p>
                    <motion.button
                      onClick={props.handleLogout}
                      className="flex-1 py-2 px-3 border border-sky-600 text-sky-600 text-center rounded-md hover:bg-sky-50 flex items-center justify-center gap-1 shadow-sm"
                      whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div className="flex-1" 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/dang-nhap"
                        onClick={props.toggleMobileMenu}
                        className="w-full block py-2.5 px-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white text-center rounded-md shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Đăng nhập
                      </Link>
                    </motion.div>
                    <motion.div className="flex-1" 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/dang-ky"
                        onClick={props.toggleMobileMenu}
                        className="w-full block py-2.5 px-3 border border-sky-600 text-sky-600 text-center rounded-md hover:bg-sky-50 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        Đăng ký
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
} 