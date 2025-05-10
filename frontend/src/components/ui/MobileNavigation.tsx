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
} from "lucide-react";

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
        <button
          type="submit"
          className="flex items-center justify-center min-w-[50px] h-[38px] border border-sky-600 rounded-r-md bg-sky-600 text-white hover:bg-white hover:text-sky-600 hover:border-sky-600 transition-colors"
          aria-label="Tìm kiếm"
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
        </button>
      </form>
    );
  };

  return (
    <>
      {props.mobileMenuOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${
            props.mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={props.toggleMobileMenu}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          props.mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header with close button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-b-blue-950/20">
            <span className="font-medium text-sky-950">Menu</span>
            <button
              onClick={props.toggleMobileMenu}
              className="text-sky-950 hover:text-sky-500"
              aria-label="Đóng menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search bar in mobile view (only visible at <md screens) */}
          <div className="px-4 py-3 border-b border-b-blue-950/20 md:hidden">
            {_renderSearchBar()}
          </div>

          {/* Mobile navigation */}
          <div className="overflow-y-auto flex-grow">
            <nav className="py-2">
              {props.navigation.map((item) => {
                const isItemActive = props.isNavActive(item.href);
                return (
                  <Link
                    key={item.id}
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
                );
              })}

              {/* Thêm các liên kết tài khoản nếu đã đăng nhập */}
              {props.isAuthenticated && props.user && (
                <div className="border-t border-t-blue-950/20 mt-2 pt-2">
                  <p className="px-4 py-2 text-sm font-medium text-sky-800">
                    Tài khoản của bạn
                  </p>
                  <Link
                    href="/ca-nhan"
                    onClick={props.toggleMobileMenu}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-sky-50 text-sky-950"
                  >
                    <User size={16} />
                    <span>Thông tin cá nhân</span>
                  </Link>
                </div>
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
                    <button
                      onClick={props.handleLogout}
                      className="flex-1 py-2 px-3 border border-sky-600 text-sky-600 text-center rounded-md hover:bg-sky-50 flex items-center justify-center gap-1"
                    >
                      <LogOut size={16} />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dang-nhap"
                      onClick={props.toggleMobileMenu}
                      className="flex-1 py-2 px-3 bg-sky-600 text-white text-center rounded-md hover:bg-sky-700"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/dang-ky"
                      onClick={props.toggleMobileMenu}
                      className="flex-1 py-2 px-3 border border-sky-600 text-sky-600 text-center rounded-md hover:bg-sky-50"
                    >
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 