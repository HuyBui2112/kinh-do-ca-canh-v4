"use client";

import { FC, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import ReviewForm from './ReviewForm';
import { 
  Review, 
  CreateReviewRequest, 
  UpdateReviewRequest 
} from '@/utils/types/review';

interface ReviewDialogProps {
  isOpen: boolean;
  productId: string;
  onClose: () => void;
  onCreateReview: (data: CreateReviewRequest) => Promise<boolean>;
  onUpdateReview?: (reviewId: string, data: UpdateReviewRequest) => Promise<boolean>;
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
  reviewToEdit
}) => {
  const [comment, setComment] = useState<string>(reviewToEdit?.comment || '');
  const [rating, setRating] = useState<number>(reviewToEdit?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Reset form khi đóng dialog hoặc khi reviewToEdit thay đổi
  const resetForm = () => {
    if (reviewToEdit) {
      setComment(reviewToEdit.comment);
      setRating(reviewToEdit.rating);
    } else {
      setComment('');
      setRating(5);
    }
    setHoverRating(0);
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
        comment: data.comment
      });
    } else {
      // Tạo đánh giá mới
      success = await onCreateReview(data);
    }
    
    if (success) {
      setTimeout(() => {
        handleClose();
      }, 1500);
    }
    
    return success;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {reviewToEdit ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <ReviewForm
                  productId={productId}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  error={error}
                  success={success}
                  onClose={handleClose}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReviewDialog; 