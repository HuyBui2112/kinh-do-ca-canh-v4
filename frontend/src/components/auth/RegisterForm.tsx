"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RegisterRequest } from "@/utils/types";
import Link from "next/link";

const RegisterForm = () => {
  const { register, error, isLoading, clearError } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Gọi hàm register từ useAuth
    const success = await register(formData);

    if (success) {
      // Đăng ký thành công, chuyển hướng hoặc thực hiện hành động tiếp theo
      router.push("/");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-sky-100">
      <p className="text-2xl font-bold mb-6 text-center text-sky-950">
        Đăng ký tài khoản
      </p>

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
          <input
            type="password"
            id="password"
            name="password"
            value={formData.info_auth.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            required
            placeholder="••••••••"
          />
          <p className="text-sm text-sky-700 mt-2">
            Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và
            ký tự đặc biệt.
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
  );
};

export default RegisterForm;
