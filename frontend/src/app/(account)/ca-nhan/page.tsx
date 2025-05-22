"use client";

import React, { useState, useEffect } from "react";
import UserProfile from "@/components/auth/UserProfile";
import UserOrders from "@/components/auth/UserOrders";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  LogIn,
  ClipboardList,
  Lock,
  ShoppingBag,
} from "lucide-react";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Người dùng có thể được chuyển đến trang đăng nhập tự động sau một khoảng thời gian
  const [redirectCountdown, setRedirectCountdown] = useState<number>(10);

  // Đếm ngược trước khi chuyển hướng
  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (!isLoading && !isAuthenticated && redirectCountdown === 0) {
      router.push("/dang-nhap");
    }
  }, [isLoading, isAuthenticated, redirectCountdown, router]);

  // Nếu đang tải thông tin xác thực
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pb-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs items={[{ slug: "/ca-nhan", label: "Cá nhân" }]} />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-sky-700 font-medium"
          >
            Đang tải thông tin tài khoản...
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-500 mt-2"
          >
            Vui lòng đợi trong giây lát
          </motion.p>
        </div>
      </div>
    );
  }

  // Nếu người dùng chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 pb-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs items={[{ slug: "/ca-nhan", label: "Cá nhân" }]} />
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Phần minh họa */}
            <div className="md:w-2/5 bg-gradient-to-br from-sky-500 to-blue-700 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 600 600"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g transform="translate(300,300)">
                    <path
                      d="M125.6,-166.3C172.9,-149.1,227.3,-125.5,245.2,-85.6C263.1,-45.7,244.5,10.6,219.4,60.4C194.3,110.3,162.7,153.7,124.3,188.7C85.8,223.7,40.6,250.4,-9.2,262.4C-59,274.4,-113.4,271.7,-162.5,249.1C-211.7,226.5,-255.5,183.9,-266.9,134.4C-278.3,84.8,-257.2,28.1,-238.7,-23.5C-220.2,-75.1,-204.2,-121.7,-174.6,-145.4C-145,-169.1,-101.9,-169.9,-65.1,-183.1C-28.3,-196.4,2.3,-222.1,34.9,-213.1C67.5,-204,78.3,-183.6,125.6,-166.3Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="mb-8 p-4 bg-white/10 backdrop-blur-md inline-block rounded-xl">
                  <Lock size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Đăng nhập để tiếp tục
                </h2>
                <p className="opacity-90 mb-8 text-lg">
                  Truy cập thông tin cá nhân, theo dõi đơn hàng và nhận các ưu
                  đãi đặc biệt.
                </p>
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/dang-nhap" className="w-full block">
                      <Button className="w-full bg-white text-sky-600 hover:bg-sky-50 flex items-center justify-center gap-2 py-6">
                        <LogIn size={18} />
                        Đăng nhập ngay
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/dang-ky" className="w-full block">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent text-white hover:bg-white/20 border-white py-6"
                      >
                        Đăng ký tài khoản mới
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Phần thông tin */}
            <div className="md:w-3/5 p-8 flex items-center">
              <div className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-center md:justify-start mb-8">
                    <ShoppingBag size={28} className="text-sky-600 mr-3" />
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Kinh Đô Cá Cảnh
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-sky-50 p-5 rounded-lg border border-sky-100">
                      <h4 className="font-medium text-sky-700 mb-2">
                        Lợi ích thành viên
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="text-sky-500 mr-2">✓</div>
                          <span className="text-gray-600">
                            Quản lý đơn hàng dễ dàng
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-sky-500 mr-2">✓</div>
                          <span className="text-gray-600">
                            Cập nhật thông tin cá nhân
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="text-sky-500 mr-2">✓</div>
                          <span className="text-gray-600">
                            Nhận các ưu đãi đặc biệt dành riêng cho thành viên
                          </span>
                        </li>
                      </ul>
                    </div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center text-gray-500 font-medium"
                    >
                      Tự động chuyển hướng sau{" "}
                      <span className="text-sky-600 font-bold">
                        {redirectCountdown}
                      </span>{" "}
                      giây
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu người dùng đã đăng nhập
  return (
    <div className="container mx-auto px-4 pb-6">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ slug: "/ca-nhan", label: "Cá nhân" }]} />

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-sky-900/30 mt-6">
        {/* Header section */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-8 py-10 relative">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 600 600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(300,300)">
                <path
                  d="M146.7,-191.2C184.1,-148.4,204.8,-98.5,214,-47.1C223.3,4.3,221.1,57.1,198.5,97.8C175.9,138.5,132.8,167,85.2,196.5C37.6,225.9,-14.5,256.2,-66.3,251.6C-118.1,246.9,-169.6,207.3,-207.7,158.1C-245.9,109,-270.8,50.2,-268.4,-7.5C-266,-65.2,-236.3,-121.9,-194.9,-164.9C-153.5,-208,-100.4,-237.4,-47.2,-235.7C6,-233.9,109.3,-234,146.7,-191.2Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </div>
          <div className="relative z-10">
            <motion.h1
              className="text-2xl md:text-3xl font-bold mb-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              Xin chào, {user?.info_user?.username?.firstname || "Thành viên"}!
            </motion.h1>
            <p className="text-white/80">
              Quản lý thông tin cá nhân và các đơn hàng của bạn
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-sky-900/30 relative bg-white">
          <motion.div
            whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              onClick={() => setActiveTab("profile")}
              className={`rounded-none w-full py-6 text-base relative z-10 transition-colors duration-200 ${
                activeTab === "profile" ? "text-white" : "text-sky-600"
              }`}
            >
              <UserRound size={18} className="mr-2" />
              Thông tin cá nhân
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              onClick={() => setActiveTab("orders")}
              className={`rounded-none w-full py-6 text-base relative z-10 transition-colors duration-200 ${
                activeTab === "orders" ? "text-white" : "text-sky-600"
              }`}
            >
              <ClipboardList size={18} className="mr-2" />
              Đơn hàng của tôi
            </Button>
          </motion.div>

          {/* Indicator */}
          <motion.div
            className="absolute bottom-0 h-1 bg-sky-600 rounded-t-md"
            initial={false}
            animate={{
              left: activeTab === "profile" ? "0%" : "50%",
              width: "50%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Tab Content */}
        <div className="px-20 py-4 bg-white">
          <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <UserProfile />
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <UserOrders />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
