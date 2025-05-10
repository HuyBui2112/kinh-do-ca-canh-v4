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
  // Render user dropdown menu
  const _renderUserDropdown = () => {
    return (
      <div className="relative" ref={prop.userMenuRef}>
        <button
          onClick={prop.toggleUserMenu}
          className="flex items-center gap-2 px-2 rounded-md hover:bg-sky-400 focus:outline-none"
          aria-expanded={prop.userMenuOpen}
        >
          <User size={16} />
          <span className="truncate">
            Xin chào, &nbsp;
            {prop.user?.info_user.username.firstname || "Tài khoản"}
          </span>
          {prop.userMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {prop.userMenuOpen && (
          <div className="absolute right-0 top-8 mt-1 w-60 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            {/* Thông tin người dùng */}
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="font-medium text-sky-950 truncate">
                {prop.user?.info_user.username.firstname}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {prop.user?.email}
              </p>
            </div>

            {/* Các liên kết tài khoản */}
            <Link
              href="/ca-nhan"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-sky-50"
              onClick={() => prop.setUserMenuOpen(false)}
            >
              <User size={16} />
              <span>Thông tin cá nhân</span>
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            {/* Đăng xuất */}
            <button
              onClick={prop.handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
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
            <div className="px-2 text-sky-100 opacity-75">Đang tải...</div>
          ) : prop.isAuthenticated && prop.user ? (
            <>
              {/* User Dropdown Menu */}
              {_renderUserDropdown()}
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                href="/dang-nhap"
                className="px-2 rounded-md hover:bg-sky-400"
              >
                Đăng nhập
              </Link>

              <span>|</span>

              {/* Register Button */}
              <Link
                href="/dang-ky"
                className="px-2 rounded-md hover:bg-sky-400"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
