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
        className="flex items-center w-full text-sm rounded-md overflow-hidden"
      >
        <input
          type="text"
          placeholder="Bạn muốn tìm gì..."
          value={props.searchKeyword}
          onChange={(e) => props.setSearchKeyword(e.target.value)}
          className="w-full px-4 py-2 text-md text-sky-950 border border-r-0 border-sky-600/15 rounded-l-md hover:border-sky-600 focus:border-sky-600 focus:outline-none"
        />
        <motion.button
          type="submit"
          className="flex items-center justify-center min-w-[50px] h-[38px] border border-sky-600 rounded-r-md bg-sky-600 text-white hover:bg-white hover:text-sky-600 hover:border-sky-600 transition-colors"
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
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={props.toggleMobileMenu}
          ></motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50"
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
          <div className="flex items-center justify-between px-4 py-3 border-b border-b-blue-950/20">
            <span className="font-medium text-sky-950">Menu</span>
            <motion.button
              onClick={props.toggleMobileMenu}
              className="text-sky-950 hover:text-sky-500"
              aria-label="Đóng menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Search bar in mobile view (only visible at <md screens) */}
          <div className="px-4 py-3 border-b border-b-blue-950/20 md:hidden">
            {_renderSearchBar()}
          </div>

          {/* Mobile navigation */}
          <div className="overflow-y-auto flex-grow">
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
                      className={`block px-4 py-3 text-sm font-medium hover:bg-sky-50 ${
                        isItemActive
                          ? "text-sky-500 border-l-4 border-sky-500"
                          : "text-sky-950"
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
                  className="border-t border-t-blue-950/20 mt-2 pt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <p className="px-4 py-2 text-sm font-medium text-sky-800">
                    Tài khoản của bạn
                  </p>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/ca-nhan"
                      onClick={props.toggleMobileMenu}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-sky-50 text-sky-950"
                    >
                      <User size={16} />
                      <span>Thông tin cá nhân</span>
                    </Link>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/gio-hang"
                      onClick={props.toggleMobileMenu}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-sky-50 text-sky-950"
                    >
                      <ShoppingCart size={16} />
                      <span>Giỏ hàng của tôi {props.itemCount > 0 && `(${props.itemCount})`}</span>
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </nav>
          </div>

          {/* Mobile top bar elements */}
          <div className="border-t border-t-blue-950/20">
            <div className="p-4 space-y-3 text-sm">
              {/* Contact info */}
              <div className="flex items-center gap-2 text-sky-950">
                <Phone size={14} />
                <span>0987 654 321</span>
              </div>
              <div className="flex items-center gap-2 text-sky-950">
                <Mail size={14} />
                <span>kinhdocacanh@gmail.com</span>
              </div>

              {/* Authentication links */}
              <div className="flex items-center gap-3 pt-2">
                {props.isAuthenticated && props.user ? (
                  <>
                    <p className="flex-1 text-sky-950 font-medium py-2">
                      Xin chào, {props.user.info_user.username.firstname || "Quý khách"}
                    </p>
                    <motion.button
                      onClick={props.handleLogout}
                      className="flex-1 py-2 px-3 border border-sky-600 text-sky-600 text-center rounded-md hover:bg-sky-50 flex items-center justify-center gap-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/dang-nhap"
                        onClick={props.toggleMobileMenu}
                        className="w-full block py-2 px-3 bg-sky-600 text-white text-center rounded-md hover:bg-sky-700"
                      >
                        Đăng nhập
                      </Link>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href="/dang-ky"
                        onClick={props.toggleMobileMenu}
                        className="w-full block py-2 px-3 border border-sky-600 text-sky-600 text-center rounded-md hover:bg-sky-50"
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