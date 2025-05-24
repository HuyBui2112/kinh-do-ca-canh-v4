"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { UpdateProfileRequest } from "@/utils/types/auth";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  User,
  LogOut,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { user, isLoading, error, updateProfile, logout } = useAuth();
  const { showToast, confirmAction } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    info_user: {
      username: user?.info_user.username,
      phone: user?.info_user.phone,
      address: user?.info_user.address,
    },
  });
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // Nếu người dùng chưa đăng nhập hoặc đang tải
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-sky-900/20"
      >
        <p className="text-2xl font-bold mb-4 text-center text-sky-950">
          Thông tin tài khoản
        </p>
        <div className="flex flex-col items-center py-8">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-full p-6 mb-4 shadow-lg">
            <UserCircle className="w-16 h-16 text-white" />
          </div>
          <p className="text-lg text-center mb-6 text-sky-900">
            Vui lòng đăng nhập để xem thông tin tài khoản.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/dang-nhap")}
            className="px-6 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-md"
          >
            Đăng nhập
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Xử lý các trường lồng nhau
    if (name === "lastname" || name === "firstname") {
      setFormData({
        ...formData,
        info_user: {
          ...formData.info_user,
          username: {
            ...(formData.info_user?.username || {
              lastname: "",
              firstname: "",
            }),
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, success: false, error: "" });

    try {
      const success = await updateProfile(formData);

      if (success) {
        setUpdateStatus({ loading: false, success: true, error: "" });
        setIsEditing(false);

        // Hiển thị thông báo thành công bằng toast
        showToast("success", "Thông tin của bạn đã được cập nhật thành công!");
      } else {
        setUpdateStatus({
          loading: false,
          success: false,
          error: "Cập nhật thất bại",
        });
        showToast("error", "Cập nhật thông tin thất bại. Vui lòng thử lại.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi";
      setUpdateStatus({ loading: false, success: false, error: errorMessage });
      showToast("error", errorMessage);
    }
  };

  const handleLogout = () => {
    // Xác nhận đăng xuất bằng toast
    confirmAction(
      "Bạn có chắc chắn muốn đăng xuất?",
      () => {
        logout();
        showToast("info", "Đã đăng xuất khỏi hệ thống");
        // Chuyển hướng về trang chủ
        window.location.href = "/";
      },
      {
        type: "warning",
        confirmLabel: "Đăng xuất",
        cancelLabel: "Hủy",
        duration: 5000, // Tự động đóng sau 5 giây
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-sky-900/20"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        >
          <p className="font-medium">Lỗi</p>
          <p>{error}</p>
        </motion.div>
      )}

      {updateStatus.success && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4"
        >
          <p className="font-medium">Thành công</p>
          <p>Cập nhật thông tin thành công!</p>
        </motion.div>
      )}

      {updateStatus.error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6"
        >
          <p className="font-medium">Lỗi</p>
          <p>{updateStatus.error}</p>
        </motion.div>
      )}

      {isEditing ? (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center text-sky-950">
            Chỉnh sửa thông tin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Họ và tên */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="lastname"
                  className="text-sky-900 font-medium mb-2 flex items-center"
                >
                  <User size={16} className="mr-2 text-sky-700" />
                  Họ
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.info_user?.username?.lastname || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/30"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="firstname"
                  className="text-sky-900 font-medium mb-2 flex items-center"
                >
                  <User size={16} className="mr-2 text-sky-700" />
                  Tên
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.info_user?.username?.firstname || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/30"
                  required
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label
                htmlFor="phone"
                className="text-sky-900 font-medium mb-2 flex items-center"
              >
                <Phone size={16} className="mr-2 text-sky-700" />
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.info_user?.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/30"
                required
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label
                htmlFor="address"
                className=" text-sky-900 font-medium mb-2 flex items-center"
              >
                <MapPin size={16} className="mr-2 text-sky-700" />
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.info_user?.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-sky-50/30"
                required
              />
            </div>

            <div className="flex gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={updateStatus.loading}
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium py-3 px-4 rounded-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-70 transition-all shadow-sm flex items-center justify-center"
              >
                {updateStatus.loading ? "Đang cập nhật..." : "Lưu thay đổi"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all shadow-sm"
              >
                Hủy
              </motion.button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-6 py-5 rounded-t-xl">
            <p className="font-medium text-xl">{`${user.info_user.username.lastname} ${user.info_user.username.firstname}`}</p>
            <div className="flex items-center mt-1">
              <Mail size={14} className="mr-2 text-sky-100" />
              <p className="text-sky-100 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div className="bg-sky-50/50 rounded-lg p-4 border border-sky-100">
                <p className="text-sky-700 text-sm font-medium mb-1 flex items-center">
                  <User size={16} className="mr-2" />
                  Họ tên
                </p>
                <p className="font-medium text-sky-950 pl-6">{`${user.info_user.username.lastname} ${user.info_user.username.firstname}`}</p>
              </div>

              <div className="bg-sky-50/50 rounded-lg p-4 border border-sky-100">
                <p className="text-sky-700 text-sm font-medium mb-1 flex items-center">
                  <Mail size={16} className="mr-2" />
                  Email
                </p>
                <p className="font-medium text-sky-950 pl-6">{user.email}</p>
              </div>

              <div className="bg-sky-50/50 rounded-lg p-4 border border-sky-100">
                <p className="text-sky-700 text-sm font-medium mb-1 flex items-center">
                  <Phone size={16} className="mr-2" />
                  Số điện thoại
                </p>
                <p className="font-medium text-sky-950 pl-6">
                  {user.info_user.phone}
                </p>
              </div>

              <div className="bg-sky-50/50 rounded-lg p-4 border border-sky-100">
                <p className="text-sky-700 text-sm font-medium mb-1 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Địa chỉ
                </p>
                <p className="font-medium text-sky-950 pl-6">
                  {user.info_user.address}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // Cập nhật formData từ dữ liệu người dùng hiện tại
                  setFormData({
                    info_user: {
                      username: user.info_user.username,
                      phone: user.info_user.phone,
                      address: user.info_user.address,
                    },
                  });
                  setIsEditing(true);
                }}
                className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium py-3 px-4 rounded-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all shadow-sm flex items-center justify-center"
              >
                <Edit size={18} className="mr-2" />
                Chỉnh sửa thông tin
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex-1 border border-red-500 bg-white text-red-500 font-medium py-3 px-4 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all shadow-sm flex items-center justify-center"
              >
                <LogOut size={18} className="mr-2" />
                Đăng xuất
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserProfile;
