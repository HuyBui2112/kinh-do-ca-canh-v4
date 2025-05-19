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
        className="flex items-center w-full md:w-70 lg:w-64 xl:w-96 text-sm rounded-md overflow-hidden"
      >
        <motion.input
          type="text"
          placeholder="Bạn muốn tìm gì..."
          value={prop.searchKeyword}
          onChange={(e) => prop.setSearchKeyword(e.target.value)}
          className="w-full px-4 py-2 text-md text-sky-950 border border-r-0 border-sky-600/15 rounded-l-md hover:border-sky-600 focus:border-sky-600 focus:outline-none"
          whileFocus={{ borderColor: 'rgb(2, 132, 199)' }}
        />
        <motion.button
          type="submit"
          className="flex items-center justify-center min-w-[50px] h-[38px] border border-sky-600 rounded-r-md bg-sky-600 text-white hover:bg-white hover:text-sky-600 hover:border-sky-600 transition-colors"
          aria-label="Tìm kiếm"
          whileHover={{ backgroundColor: 'white', color: 'rgb(2, 132, 199)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Search size={18} />
        </motion.button>
      </form>
    );
  };

  // Render cart button
  const _renderCartButton = () => {
    return (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href="/gio-hang"
          className="relative w-[40px] h-[38px] mr-4 flex items-center justify-center text-sky-950 hover:text-sky-500"
        >
          <ShoppingCart size={22} />
          {prop.itemCount > 0 && (
            <motion.div 
              className="absolute -top-1 left-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="bg-red-500 border border-white text-white text-xs font-medium rounded-full h-5 flex items-center justify-center px-1.5">
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
      <div className="flex items-center justify-between text-sky-950 text-sm font-medium gap-6 xl:gap-10">
        {prop.navigation.map((item) => {
          const isItemActive = prop.isNavActive(item.href);
          return (
            <motion.div
              key={item.id}
              className={`relative hover:text-sky-500 ${
                isItemActive ? "text-sky-500" : ""
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={item.href}
                className={`h-[52px] flex items-center ${
                  isItemActive
                    ? "text-sky-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-sky-500"
                    : ""
                }`}
              >
                <p>{item.title}</p>
              </Link>
              {!isItemActive && (
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-sky-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
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
        className="ml-4 text-sky-950 hover:text-sky-500 focus:outline-none"
        aria-expanded={prop.mobileMenuOpen}
        aria-label="Menu chính"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: 90 }}
      >
        <Menu size={24} />
      </motion.button>
    );
  };

  return (
    <div className="bg-white h-[52px] flex items-center">
      {/* Screen >= 1024px */}
      <div className="hidden container h-[52px] lg:grid lg:grid-cols-5">
        <div className="col-span-3 flex items-center gap-10 xl:gap-25">
          {/* Logo */}
          <Link href="/">
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
      <div className="container h-[52px] grid grid-cols-4 lg:hidden">
        <div className="flex items-center col-span-3 justify-between">
          {/* Logo */}
          <Link href="/">
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
                />
              </div>
            </motion.div>

            {/* Screen < 440px */}
            <motion.div 
              className="block min-[440px]:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 10 }}
            >
              <div className="relative w-[44px] h-[44px]">
                <Image
                  src="/logos/kinhdocacanh-logo-small.png"
                  alt="Logo Kinh Đô Cá Cảnh"
                  fill
                  priority
                  sizes="44px"
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
        <div className="flex items-center justify-end">
          {_renderCartButton()}
          {_renderHamburgerButton()}
        </div>
      </div>
    </div>
  );
}
