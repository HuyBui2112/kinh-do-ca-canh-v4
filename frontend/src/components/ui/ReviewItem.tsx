"use client";

import { FC } from "react";
import { Review } from "@/utils/types/review";
import { formatDate } from "@/utils/helpers";
import { useToast } from "@/contexts/ToastContext";
import { motion } from "framer-motion";

interface ReviewItemProps {
  review: Review;
  canModify?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => void;
}

/**
 * Component hiển thị một đánh giá
 */
const ReviewItem: FC<ReviewItemProps> = ({
  review,
  canModify,
  onEdit,
  onDelete,
}) => {
  const { confirmAction } = useToast();

  // Trích xuất thông tin người dùng từ đánh giá
  const getUserName = () => {
    if (typeof review.user_id === "string") {
      return "Người dùng";
    }

    const { lastname, firstname } = review.user_id.info_user.username;
    return `${lastname} ${firstname}`;
  };

  // Lấy rating từ trường raing (lỗi đánh máy từ API)
  const getRating = () => {
    return review.rating || 0;
  };

  // Xử lý xóa đánh giá với xác nhận qua toast
  const handleDelete = () => {
    if (onDelete) {
      confirmAction(
        "Bạn có chắc chắn muốn xóa đánh giá này không?",
        () => onDelete(review._id),
        {
          type: "warning",
          confirmLabel: "Xóa",
          cancelLabel: "Hủy",
          duration: 8000, // Tự động đóng sau 8 giây
        }
      );
    }
  };

  return (
    <motion.div 
      className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25 }}
      whileHover={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium text-gray-800">{getUserName()}</div>
          <div className="text-xs text-gray-500">
            {formatDate(review.createdAt)}
          </div>
        </div>

        {canModify && (
          <div className="flex space-x-3">
            {onEdit && (
              <motion.button
                onClick={() => onEdit(review)}
                className="flex items-center text-yellow-600 hover:text-yellow-800 text-sm bg-yellow-50 px-3 py-1 rounded-md"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(254, 249, 195, 1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Sửa
              </motion.button>
            )}
            {onDelete && (
              <motion.button
                onClick={handleDelete}
                className="flex items-center text-red-600 hover:text-red-800 text-sm bg-red-50 px-3 py-1 rounded-md"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(254, 226, 226, 1)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Xóa
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Hiển thị sao đánh giá */}
      <div className="flex items-center mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-lg mr-1"
            style={{ color: i < getRating() ? "#FBBF24" : "#D1D5DB" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          >
            ★
          </motion.span>
        ))}
      </div>

      <motion.div 
        className="text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {review.comment}
      </motion.div>
    </motion.div>
  );
};

export default ReviewItem;
