"use client";

import { useState, useCallback } from 'react';
import { apis } from '../services/apis';
import { 
  Review, 
  CreateReviewRequest, 
  UpdateReviewRequest,
  ReviewQueryParams
} from '../utils/types/review';
import { useAuth } from './useAuth';

/**
 * Hook cung cấp các chức năng quản lý đánh giá sản phẩm
 * @returns Các phương thức và trạng thái liên quan đến đánh giá
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  /**
   * Lấy danh sách đánh giá của sản phẩm
   * @param productId ID của sản phẩm
   * @param params Các tham số phân trang
   */
  const getProductReviews = useCallback(async (productId: string, params?: ReviewQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apis.getProductReviews(productId, params);
      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải đánh giá sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tạo đánh giá mới cho sản phẩm
   * @param data Thông tin đánh giá
   */
  const createReview = useCallback(async (data: CreateReviewRequest) => {
    if (!isAuthenticated) {
      setError('Bạn cần đăng nhập để đánh giá sản phẩm');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apis.createReview(data);
      if (response.success) {
        // Cập nhật danh sách đánh giá
        setReviews(prev => [response.data, ...prev]);
        setSuccess('Đánh giá của bạn đã được ghi nhận');
        return true;
      }
      return false;
    } catch (err: any) {
      // Xử lý lỗi từ API
      if (err.response && err.response.data) {
        // Nếu server trả về lỗi đã đánh giá
        if (err.response.data.message && err.response.data.message.includes("đã đánh giá")) {
          setError('Bạn đã đánh giá sản phẩm này rồi');
          
          // Tải lại danh sách đánh giá để cập nhật giao diện
          if (data.productId) {
            getProductReviews(data.productId);
          }
        } else {
          setError(err.response.data.message || 'Có lỗi xảy ra khi gửi đánh giá');
        }
      } else {
        setError(err?.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
      console.error('Lỗi khi tạo đánh giá:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getProductReviews]);

  /**
   * Cập nhật đánh giá
   * @param reviewId ID của đánh giá
   * @param data Thông tin cập nhật
   */
  const updateReview = useCallback(async (reviewId: string, data: UpdateReviewRequest) => {
    if (!isAuthenticated) {
      setError('Bạn cần đăng nhập để chỉnh sửa đánh giá');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apis.updateReview(reviewId, data);
      if (response.success) {
        // Cập nhật đánh giá trong danh sách
        setReviews(prev => 
          prev.map(review => 
            review._id === reviewId ? response.data : review
          )
        );
        setSuccess('Đánh giá đã được cập nhật');
        return true;
      }
      return false;
    } catch (err: any) {
      // Xử lý lỗi từ API
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Có lỗi xảy ra khi cập nhật đánh giá');
      } else {
        setError(err?.message || 'Có lỗi xảy ra khi cập nhật đánh giá');
      }
      console.error('Lỗi khi cập nhật đánh giá:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Xóa đánh giá
   * @param reviewId ID của đánh giá
   */
  const deleteReview = useCallback(async (reviewId: string) => {
    if (!isAuthenticated) {
      setError('Bạn cần đăng nhập để xóa đánh giá');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await apis.deleteReview(reviewId);
      if (response.success) {
        // Xóa đánh giá khỏi danh sách
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        setSuccess('Đánh giá đã được xóa');
        return true;
      }
      return false;
    } catch (err: any) {
      // Xử lý lỗi từ API
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Có lỗi xảy ra khi xóa đánh giá');
      } else {
        setError(err?.message || 'Có lỗi xảy ra khi xóa đánh giá');
      }
      console.error('Lỗi khi xóa đánh giá:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Kiểm tra xem người dùng đã đánh giá sản phẩm chưa
   * @param productId ID của sản phẩm
   * @param userId ID của người dùng
   */
  const hasUserReviewed = useCallback((productId: string, userId: string): boolean => {
    return reviews.some(review => {
      if (review.product_id !== productId) return false;
      
      // Nếu user_id là một chuỗi (ID), so sánh trực tiếp
      if (typeof review.user_id === 'string') {
        return review.user_id === userId;
      } 
      
      // Nếu user_id là đối tượng ReviewUser, kiểm tra thông tin username
      return !!review.user_id;
    });
  }, [reviews]);

  /**
   * Xóa thông báo lỗi hoặc thành công
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    // Trạng thái
    reviews,
    pagination,
    loading,
    error,
    success,
    
    // Phương thức
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    hasUserReviewed,
    clearMessages
  };
}; 