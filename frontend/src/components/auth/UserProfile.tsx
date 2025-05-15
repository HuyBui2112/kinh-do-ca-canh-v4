"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { UpdateProfileRequest } from '@/utils/types';
import { UserCircle } from 'lucide-react';

const UserProfile = () => {
  const { user, isLoading, error, updateProfile, logout } = useAuth();
  const { showToast, confirmAction } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    info_user: {
      username: user?.info_user.username,
      phone: user?.info_user.phone,
      address: user?.info_user.address
    }
  });
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: ''
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
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-sky-100">
        <p className="text-2xl font-bold mb-4 text-center text-sky-950">Thông tin tài khoản</p>
        <div className="flex flex-col items-center py-8">
          <div className="bg-sky-100 rounded-full p-5 mb-4">
            <UserCircle className="w-16 h-16 text-sky-600" />
          </div>
          <p className="text-lg text-center mb-6 text-sky-900">
            Vui lòng đăng nhập để xem thông tin tài khoản.
          </p>
          <button 
            onClick={() => window.location.href = '/dang-nhap'}
            className="px-6 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Xử lý các trường lồng nhau
    if (name === 'lastname' || name === 'firstname') {
      setFormData({
        ...formData,
        info_user: {
          ...formData.info_user,
          username: {
            ...formData.info_user?.username || { lastname: '', firstname: '' },
            [name]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        info_user: {
          ...formData.info_user,
          [name]: value
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, success: false, error: '' });
    
    try {
      const success = await updateProfile(formData);
      
      if (success) {
        setUpdateStatus({ loading: false, success: true, error: '' });
        setIsEditing(false);
        
        // Hiển thị thông báo thành công bằng toast
        showToast("success", "Thông tin của bạn đã được cập nhật thành công!");
      } else {
        setUpdateStatus({ loading: false, success: false, error: 'Cập nhật thất bại' });
        showToast("error", "Cập nhật thông tin thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Đã xảy ra lỗi';
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
        duration: 5000  // Tự động đóng sau 5 giây
      }
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md border border-sky-100">
      <p className="text-2xl font-bold mb-6 text-center text-sky-950">Thông tin tài khoản</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p className="font-medium">Lỗi</p>
          <p>{error}</p>
        </div>
      )}
      
      {updateStatus.success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p className="font-medium">Thành công</p>
          <p>Cập nhật thông tin thành công!</p>
        </div>
      )}
      
      {updateStatus.error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p className="font-medium">Lỗi</p>
          <p>{updateStatus.error}</p>
        </div>
      )}
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Họ và tên */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lastname" className="block text-sky-900 font-medium mb-2">
                Họ
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.info_user?.username?.lastname || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="firstname" className="block text-sky-900 font-medium mb-2">
                Tên
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.info_user?.username?.firstname || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          
          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-sky-900 font-medium mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.info_user?.phone || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          {/* Địa chỉ */}
          <div>
            <label htmlFor="address" className="block text-sky-900 font-medium mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.info_user?.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={updateStatus.loading}
              className="flex-1 bg-sky-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-sky-300 transition-all"
            >
              {updateStatus.loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-sky-50 rounded-lg overflow-hidden">
          <div className="bg-sky-600 text-white px-6 py-4">
            <p className="font-medium">{`${user.info_user.username.lastname} ${user.info_user.username.firstname}`}</p>
            <p className="text-sky-100 text-sm">{user.email}</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sky-800 text-sm font-medium mb-1">Họ tên</p>
              <p className="font-medium text-sky-950">{`${user.info_user.username.lastname} ${user.info_user.username.firstname}`}</p>
            </div>
            
            <div>
              <p className="text-sky-800 text-sm font-medium mb-1">Email</p>
              <p className="font-medium text-sky-950">{user.email}</p>
            </div>
            
            <div>
              <p className="text-sky-800 text-sm font-medium mb-1">Số điện thoại</p>
              <p className="font-medium text-sky-950">{user.info_user.phone}</p>
            </div>
            
            <div>
              <p className="text-sky-800 text-sm font-medium mb-1">Địa chỉ</p>
              <p className="font-medium text-sky-950">{user.info_user.address}</p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => {
                  // Cập nhật formData từ dữ liệu người dùng hiện tại
                  setFormData({
                    info_user: {
                      username: user.info_user.username,
                      phone: user.info_user.phone,
                      address: user.info_user.address
                    }
                  });
                  setIsEditing(true);
                }}
                className="flex-1 bg-sky-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all"
              >
                Chỉnh sửa thông tin
              </button>
              
              <button
                onClick={handleLogout}
                className="flex-1 border border-red-500 text-red-500 font-medium py-3 px-4 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 