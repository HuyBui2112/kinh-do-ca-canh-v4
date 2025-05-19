"use client";

import { FC, useState, useEffect } from 'react';
import { CreateReviewRequest } from '@/utils/types/review';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  productId: string;
  onSubmit: (data: CreateReviewRequest) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  onClose?: () => void;
  initialComment?: string;
  initialRating?: number;
}

/**
 * Component form đánh giá sản phẩm
 */
const ReviewForm: FC<ReviewFormProps> = ({ 
  productId, 
  onSubmit, 
  isSubmitting,
  error,
  success,
  onClose,
  initialComment = "",
  initialRating = 5
}) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(initialRating);
  const [comment, setComment] = useState<string>(initialComment);
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    setComment(initialComment);
  }, [initialComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    await onSubmit({
      productId,
      rating,
      comment
    });
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        className="bg-gray-50 p-4 rounded-md text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-gray-700 mb-3">Bạn cần đăng nhập để đánh giá sản phẩm</p>
        <motion.button 
          className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm hover:bg-sky-700"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Đóng
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-800">Đánh giá sản phẩm</h3>
      
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {success}
        </motion.div>
      )}

      <div className="flex flex-col">
        <label className="text-sm text-gray-700 mb-1">Đánh giá của bạn</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 1 }}
              animate={{ 
                scale: (hoverRating || rating) >= star ? 1.1 : 1,
                y: (hoverRating || rating) >= star ? -2 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= star
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ rotateY: 0 }}
                animate={{ 
                  rotateY: (hoverRating || rating) >= star ? 0 : 180,
                  scale: (hoverRating || rating) >= star ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            </motion.button>
          ))}
          <motion.span 
            className="ml-2 text-sm text-gray-600"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            key={rating} // Để animation chạy lại khi rating thay đổi
          >
            {rating === 1 && 'Rất không hài lòng'}
            {rating === 2 && 'Không hài lòng'}
            {rating === 3 && 'Bình thường'}
            {rating === 4 && 'Hài lòng'}
            {rating === 5 && 'Rất hài lòng'}
          </motion.span>
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="comment" className="text-sm text-gray-700 mb-1">
          Nhận xét của bạn
        </label>
        <motion.textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
          rows={4}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          required
          initial={{ height: 100 }}
          animate={{ height: comment.length > 100 ? 150 : 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          whileFocus={{ borderColor: "rgb(14, 165, 233)" }}
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onClose && (
          <motion.button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05, backgroundColor: "rgb(249, 250, 251)" }}
            whileTap={{ scale: 0.95 }}
          >
            Hủy
          </motion.button>
        )}
        <motion.button
          type="submit"
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-70"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05, backgroundColor: "rgb(234, 179, 8)" }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ReviewForm; 