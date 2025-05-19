"use client";

import { FC, useState, Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import ReviewForm from "./ReviewForm";
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
} from "@/utils/types/review";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewDialogProps {
  isOpen: boolean;
  productId: string;
  onClose: () => void;
  onCreateReview: (data: CreateReviewRequest) => Promise<boolean>;
  onUpdateReview?: (
    reviewId: string,
    data: UpdateReviewRequest
  ) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  reviewToEdit?: Review | null;
}

/**
 * Component popup đánh giá sản phẩm
 */
const ReviewDialog: FC<ReviewDialogProps> = ({
  isOpen,
  productId,
  onClose,
  onCreateReview,
  onUpdateReview,
  isSubmitting,
  error,
  success,
  reviewToEdit,
}) => {
  const [comment, setComment] = useState<string>(reviewToEdit?.comment || "");
  const [rating, setRating] = useState<number>(reviewToEdit?.rating || 5);

  // Reset form khi đóng dialog hoặc khi reviewToEdit thay đổi
  const resetForm = () => {
    if (reviewToEdit) {
      setComment(reviewToEdit.comment);
      setRating(reviewToEdit.rating);
    } else {
      setComment("");
      setRating(5);
    }
  };

  // Xử lý đóng dialog
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      resetForm();
    }
  };

  // Xử lý gửi đánh giá
  const handleSubmit = async (data: CreateReviewRequest) => {
    let success;

    if (reviewToEdit && onUpdateReview) {
      // Cập nhật đánh giá
      success = await onUpdateReview(reviewToEdit._id, {
        rating: data.rating,
        comment: data.comment,
      });
    } else {
      // Tạo đánh giá mới
      success = await onCreateReview(data);
    }

    if (success) {
      setTimeout(() => {
        handleClose();
      }, 600);
    }

    return success;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={handleClose} 
          open={isOpen}
        >
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {reviewToEdit ? "Chỉnh sửa đánh giá" : "Đánh giá sản phẩm"}
                  </h2>
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ReviewForm
                    productId={productId}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={error}
                    success={success}
                    onClose={handleClose}
                    initialComment={comment}
                    initialRating={rating}
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ReviewDialog;
