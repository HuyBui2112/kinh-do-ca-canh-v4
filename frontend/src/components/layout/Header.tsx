"use client";

import React from "react";
import TopBar from "../ui/TopBar";
import MainHead from "../ui/MainHead";
import MobileNavigation from "../ui/MobileNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface NavigationType {
  id: number;
  title: string;
  href: string;
}

export default function Header() {
  // Navigation Data
  const navigation: NavigationType[] = [
    {
      id: 1,
      title: "Sản phẩm",
      href: "/san-pham",
    },
    {
      id: 2,
      title: "Bài viết",
      href: "/bai-viet",
    },
    {
      id: 3,
      title: "Về chúng tôi",
      href: "/ve-chung-toi",
    },
    {
      id: 4,
      title: "Liên hệ",
      href: "/lien-he",
    },
  ];

  // Context user
  const { user, isLoading, error, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  // Hooks
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Đóng dropdown menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to check if a navigation item is active
  const isNavActive = (navHref: string) => {
    // Special case for homepage
    if (navHref === "/" && pathname === "/") return true;

    // Check if current path exactly matches the nav href
    if (navHref !== "#" && pathname === navHref) return true;

    // Check if current path starts with the nav href (for nested routes)
    if (navHref !== "/" && navHref !== "#" && pathname.startsWith(navHref))
      return true;

    return false;
  };

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra từ khóa tìm kiếm có hợp lệ không
    if (!searchKeyword || searchKeyword.trim() === "") {
      return;
    }
    
    // Chuyển hướng đến trang tìm kiếm với từ khóa
    router.push(`/tim-kiem?q=${encodeURIComponent(searchKeyword.trim())}`);
    
    // Đóng menu mobile nếu đang mở
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Đóng user menu nếu đang mở
    if (userMenuOpen) setUserMenuOpen(false);
  };

  // Toggle user dropdown menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="min-w-[320px] bg-white border-b border-sky-950/15 sticky top-0 z-40">
      {/* Top Bar - only visible on large screen */}
      <TopBar
        user={user}
        loading={isLoading}
        error={error}
        isAuthenticated={isAuthenticated}
        userMenuRef={userMenuRef}
        toggleUserMenu={toggleUserMenu}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        handleLogout={handleLogout}
      />

      {/* Main Head */}
      <MainHead 
        navigation={navigation}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        handleSearch={handleSearch}
        isNavActive={isNavActive}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        itemCount={itemCount}
      />

      {/* Mobile Navigation Menu */}
      <MobileNavigation 
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        handleLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        user={user}
        navigation={navigation}
        isNavActive={isNavActive}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        handleSearch={handleSearch}
        itemCount={itemCount}
      />
    </header>
  );
}
