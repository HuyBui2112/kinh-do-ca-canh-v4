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
import { UserRound, LogIn, ClipboardList, Lock } from "lucide-react";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const { isAuthenticated, isLoading } = useAuth();
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
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs items={[{ slug: "/ca-nhan", label: "Cá nhân" }]} />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500"
          >
            Đang tải thông tin tài khoản...
          </motion.p>
        </div>
      </div>
    );
  }

  // Nếu người dùng chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs items={[{ slug: "/ca-nhan", label: "Cá nhân" }]} />
        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Lock size={32} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-800 mb-4"
            >
              Yêu cầu đăng nhập
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6"
            >
              Bạn cần đăng nhập để xem thông tin cá nhân và quản lý đơn hàng của
              mình.
            </motion.p>

            <div className="flex flex-col gap-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/dang-nhap" className="w-full block">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <LogIn size={18} />
                    Đăng nhập ngay
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/dang-ky" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Đăng ký tài khoản mới
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 mt-6"
            >
              Tự động chuyển hướng đến trang đăng nhập sau {redirectCountdown}{" "}
              giây
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Nếu người dùng đã đăng nhập
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <Breadcrumbs items={[{ slug: "/ca-nhan", label: "Cá nhân" }]} />

      <motion.h1
        className="text-2xl md:text-3xl font-bold text-sky-600 mt-4 mb-2 lg:mb-4"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        Tài khoản của tôi
      </motion.h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6 relative">
        <motion.div
          whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            onClick={() => setActiveTab("profile")}
            className={`rounded-none px-5 py-2 relative z-10 transition-colors duration-200 ${
              activeTab === "profile" ? "text-white" : ""
            }`}
          >
            <UserRound size={16} className="mr-2" />
            Thông tin cá nhân
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            onClick={() => setActiveTab("orders")}
            className={`rounded-none px-5 py-2 relative z-10 transition-colors duration-200 ${
              activeTab === "orders" ? "text-white" : ""
            }`}
          >
            <ClipboardList size={16} className="mr-2" />
            Đơn hàng của tôi
          </Button>
        </motion.div>

        {/* Indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-primary"
          initial={false}
          animate={{
            left: activeTab === "profile" ? "0%" : "50%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto">
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
  );
}
