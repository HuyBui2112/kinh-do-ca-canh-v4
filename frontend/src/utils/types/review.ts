// Cấu trúc người dùng rút gọn cho reviews
export interface ReviewUser {
  _id: string;
  info_user: {
    username: {
      lastname: string;
      firstname: string;
    }
  }
}

// Cấu trúc đánh giá chi tiết
export interface Review {
  _id: string;
  user_id: string | ReviewUser;
  product_id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Tham số để tạo đánh giá mới
export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

// Tham số để cập nhật đánh giá
export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

// Tham số lọc và phân trang đánh giá
export interface ReviewQueryParams {
  page?: number;
  limit?: number;
}

// Response đánh giá đơn
export interface ReviewResponse {
  success: boolean;
  data: Review;
}

// Response danh sách đánh giá
export interface ReviewListResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }
  }
}

// Response xóa đánh giá
export interface DeleteReviewResponse {
  success: boolean;
  message: string;
} 