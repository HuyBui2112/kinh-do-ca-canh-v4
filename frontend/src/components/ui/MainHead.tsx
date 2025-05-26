import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NavigationType } from "../layout/Header";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { motion } from "framer-motion";

interface NavigationProp {
  navigation: NavigationType[];
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  isNavActive: (href: string) => boolean;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  itemCount: number;
}

export default function MainHead(prop: NavigationProp) {
  // Render search bar
  const _renderSearchBar = () => {
    return (
      <form
        onSubmit={prop.handleSearch}
        className="flex items-center w-full md:w-70 lg:w-64 xl:w-96 text-sm rounded-md overflow-hidden shadow-sm"
      >
        <motion.input
          type="text"
          placeholder="Bạn muốn tìm gì..."
          value={prop.searchKeyword}
          onChange={(e) => prop.setSearchKeyword(e.target.value)}
          className="w-full px-4 py-2.5 text-md text-sky-950 border border-r-0 border-sky-600/20 rounded-l-md focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
          whileFocus={{ scale: 1.01 }}
        />
        <button
          type="submit"
          className="flex items-center justify-center min-w-[50px] h-[42px] border border-sky-600 rounded-r-md bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-white hover:to-white hover:text-sky-600 hover:border-sky-600 transition-colors duration-300"
          aria-label="Tìm kiếm"
        >
          <Search size={18} />
        </button>
      </form>
    );
  };

  // Render cart button
  const _renderCartButton = () => {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/gio-hang"
          title="Xem giỏ hàng tại: Giỏ hàng - Kinh Đô Cá Cảnh"
          className="relative w-[45px] h-[42px] mr-4 flex items-center justify-center text-sky-700 hover:text-sky-600 transition-colors duration-200"
        >
          <span className="absolute inset-0 bg-sky-50/80 rounded-full -z-10 shadow-sm"></span>
          <ShoppingCart size={22} />
          {prop.itemCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="bg-red-500 border-2 border-white shadow-md text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                {prop.itemCount}
              </span>
            </motion.div>
          )}
        </Link>
      </motion.div>
    );
  };

  // Render Navigation
  const _renderNavigationDesktop = () => (
    <>
      {/* Screen >= 1280px */}
      <div className="flex items-center justify-between text-sky-800 text-sm font-medium gap-6 xl:gap-10">
        {prop.navigation.map((item) => {
          const isItemActive = prop.isNavActive(item.href);
          return (
            <motion.div
              key={item.id}
              className={`relative hover:text-sky-600 ${
                isItemActive ? "text-sky-600" : ""
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={item.href}
                title={`Xem chi tiết tại: ${item.title} - Kinh Đô Cá Cảnh`}
                className={`h-[52px] flex items-center ${
                  isItemActive
                    ? "text-sky-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-600 after:shadow-sm"
                    : ""
                }`}
              >
                <p className="font-medium">{item.title}</p>
              </Link>
              {!isItemActive && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-sky-600 shadow-sm"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );

  // Render hamburger menu button
  const _renderHamburgerButton = () => {
    return (
      <motion.button
        onClick={prop.toggleMobileMenu}
        className="ml-4 flex items-center justify-center w-[40px] h-[40px] rounded-full bg-sky-50/80 text-sky-700 hover:bg-sky-100 hover:text-sky-800 transition-colors duration-200"
        aria-expanded={prop.mobileMenuOpen}
        aria-label="Menu chính"
        whileHover={{ scale: 1.1, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.9, rotate: 90 }}
      >
        <Menu size={24} />
      </motion.button>
    );
  };

  return (
    <div className="bg-white h-[52px] flex items-center border-b border-sky-100 shadow-sm">
      {/* Screen >= 1024px */}
      <div className="hidden container h-[52px] lg:grid lg:grid-cols-5">
        <div className="col-span-3 flex items-center gap-10 xl:gap-25">
          {/* Logo */}
          <Link href="/" title="Trang chủ - Kinh Đô Cá Cảnh">
            <motion.div
              className="hidden lg:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-[215px] h-[43px]">
                <Image
                  src="/logos/kinhdocacanh-logo-full.png"
                  alt="Logo Kinh Đô Cá Cảnh"
                  fill
                  priority
                  sizes="215px"
                  title="Logo Kinh Đô Cá Cảnh"
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          {_renderNavigationDesktop()}
        </div>

        {/* Header Button */}
        <div className="col-span-2 flex items-center justify-end lg:gap-10 xl:gap-30">
          {/* Search Bar */}
          {_renderSearchBar()}

          {/* Cart Button */}
          {_renderCartButton()}
        </div>
      </div>

      {/* Screen < 1024px */}
      <div className="container h-[52px] grid grid-cols-2 min-[500px]:grid-cols-4 lg:hidden">
        <div className="flex items-center min-[500px]:col-span-3 justify-between">
          {/* Logo */}
          <Link href="/" title="Trang chủ - Kinh Đô Cá Cảnh">
            {/* Screen >= 440px */}
            <motion.div
              className="hidden min-[440px]:block lg:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-[196px] h-[44px]">
                <Image
                  src="/logos/kinhdocacanh-logo-half-full.png"
                  alt="Logo Kinh Đô Cá Cảnh"
                  fill
                  priority
                  sizes="196px"
                  className="drop-shadow-sm"
                  title="Logo Kinh Đô Cá Cảnh"
                />
              </div>
            </motion.div>

            {/* Screen < 440px */}
            <motion.div
              className="block min-[440px]:hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9, rotate: 10 }}
            >
              <div className="relative w-[44px] h-[44px]">
                <Image
                  src="/logos/kinhdocacanh-logo-small.png"
                  alt="Logo Kinh Đô Cá Cảnh"
                  fill
                  priority
                  title="Logo Kinh Đô Cá Cảnh"
                  sizes="44px"
                  className="drop-shadow-sm"
                />
              </div>
            </motion.div>
          </Link>

          {/* Search bar only visible at md screens and above */}
          <div className="hidden md:flex md:items-center lg:hidden">
            {_renderSearchBar()}
          </div>
        </div>

        {/* Cart and Hamburger Menu Button */}
        <div className="flex items-center justify-end min-w-[115px]">
          {_renderCartButton()}
          {_renderHamburgerButton()}
        </div>
      </div>
    </div>
  );
}
