"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { AuthInfo } from "@/utils/types/auth";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const LoginForm = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<AuthInfo>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) clearError();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Gọi hàm login từ useAuth
    const success = await login(formData);

    if (success) {
      // Hiển thị toast thành công
      showToast("success", "Đăng nhập thành công! Chào mừng bạn trở lại.");

      // Đăng nhập thành công, chuyển hướng hoặc thực hiện hành động tiếp theo
      router.push("/");
    } else if (error) {
      // Hiển thị toast lỗi
      showToast(
        "error",
        error || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Phần hình ảnh bên trái */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/50 to-sky-700/70 z-10"></div>
        <Image
          src="/images/backgrounds/background-image-01.jpg"
          alt="Kinh Đô Cá Cảnh"
          fill
          sizes="(max-width: 512px) 100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Chào mừng trở lại!
          </h2>
          <p className="text-white/90 text-center max-w-md">
            Đăng nhập để xem các sản phẩm ưa thích, đơn hàng và nhiều hơn nữa từ
            Kinh Đô Cá Cảnh.
          </p>
        </div>
      </div>

      {/* Phần form bên phải */}
      <div className="w-full md:w-1/2 py-8 px-8 md:px-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-sky-950 text-center">
            Đăng nhập
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <p className="font-medium">Lỗi</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sky-900 font-medium mb-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sky-900 font-medium"
                >
                  Mật khẩu
                </label>
                <Link
                  href="#"
                  className="text-sm text-gray-400 cursor-not-allowed pointer-events-none relative group"
                  onClick={(e) => e.preventDefault()}
                  title="Tính năng đang được phát triển"
                >
                  Quên mật khẩu?
                  <span className="hidden group-hover:block absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    Tính năng đang phát triển
                  </span>
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-sky-600" />
                  ) : (
                    <Eye size={20} className="text-sky-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-sky-300 transition-all"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="text-center mt-6">
              <p className="text-sky-800">
                Chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="text-sky-600 hover:text-sky-800 font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
