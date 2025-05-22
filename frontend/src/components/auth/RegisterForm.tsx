"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { RegisterRequest } from "@/utils/types";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const RegisterForm = () => {
  const { register, error, isLoading, clearError } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<RegisterRequest>({
    info_user: {
      username: {
        lastname: "",
        firstname: "",
      },
      phone: "",
      address: "",
    },
    info_auth: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Xử lý các trường lồng nhau
    if (name === "email" || name === "password") {
      setFormData({
        ...formData,
        info_auth: {
          ...formData.info_auth,
          [name]: value,
        },
      });
    } else if (name === "lastname" || name === "firstname") {
      setFormData({
        ...formData,
        info_user: {
          ...formData.info_user,
          username: {
            ...formData.info_user.username,
            [name]: value,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        info_user: {
          ...formData.info_user,
          [name]: value,
        },
      });
    }

    if (error) clearError();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Gọi hàm register từ useAuth
    const success = await register(formData);

    if (success) {
      // Hiển thị toast thành công
      showToast(
        "success",
        "Đăng ký thành công! Chào mừng bạn đến với Kinh Đô Cá Cảnh."
      );

      // Đăng ký thành công, chuyển hướng hoặc thực hiện hành động tiếp theo
      router.push("/");
    } else if (error) {
      // Hiển thị toast lỗi
      showToast(
        "error",
        error || "Đăng ký thất bại. Vui lòng kiểm tra thông tin đăng ký."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Phần form bên trái */}
      <div className="w-full md:w-1/2 py-8 px-8 md:px-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-sky-950 text-center">
            Đăng ký tài khoản
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <p className="font-medium">Lỗi</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Họ và tên */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sky-900 font-medium mb-2"
                >
                  Họ
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.info_user.username.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                  placeholder="Họ"
                />
              </div>
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sky-900 font-medium mb-2"
                >
                  Tên
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.info_user.username.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  required
                  placeholder="Tên và tên đệm"
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sky-900 font-medium mb-2"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.info_user.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
                placeholder="**** *** ***"
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label
                htmlFor="address"
                className="block text-sky-900 font-medium mb-2"
              >
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.info_user.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
                placeholder="Nhập địa chỉ nhận hàng"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sky-900 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.info_auth.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
                placeholder="Nhập email của bạn"
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label
                htmlFor="password"
                className="block text-sky-900 font-medium mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.info_auth.password}
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
              <p className="text-sm text-gray-700/60 mt-2">
                Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường,
                số và ký tự đặc biệt
              </p>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-sky-300 transition-all"
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký tài khoản"}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sky-800">
                Đã có tài khoản?{" "}
                <Link
                  href="/dang-nhap"
                  className="text-sky-600 hover:text-sky-800 font-medium"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Phần hình ảnh bên phải */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-sky-500/50 to-sky-700/70 z-10"></div>
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
            Tham gia cùng chúng tôi!
          </h2>
          <p className="text-white/90 text-center max-w-md">
            Tạo tài khoản để khám phá thế giới cá cảnh tuyệt vời, nhận thông tin
            ưu đãi và theo dõi đơn hàng một cách dễ dàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
