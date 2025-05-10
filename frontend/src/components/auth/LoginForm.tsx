"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AuthInfo } from "@/utils/types";
import Link from "next/link";

const LoginForm = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const [formData, setFormData] = useState<AuthInfo>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Gọi hàm login từ useAuth
    const success = await login(formData);

    if (success) {
      // Đăng nhập thành công, chuyển hướng hoặc thực hiện hành động tiếp theo
      router.push("/");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-sky-100">
      <p className="text-2xl font-bold mb-6 text-center text-sky-950">
        Đăng nhập
      </p>

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
              href="/quen-mat-khau"
              className="text-sm text-sky-600 hover:text-sky-800"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
              placeholder="••••••••"
            />
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
  );
};

export default LoginForm;
