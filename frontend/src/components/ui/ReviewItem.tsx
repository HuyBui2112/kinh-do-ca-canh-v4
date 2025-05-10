"use client";

import { FC } from 'react';
import { Review } from '@/utils/types/review';
import { formatDate } from '@/utils/helpers';

interface ReviewItemProps {
  review: Review;
  canModify: boolean;
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
  onDelete
}) => {
  // Trích xuất thông tin người dùng từ đánh giá
  const getUserName = () => {
    if (typeof review.user_id === 'string') {
      return 'Người dùng';
    }
    
    const { lastname, firstname } = review.user_id.info_user.username;
    return `${lastname} ${firstname}`;
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-medium text-gray-800">{getUserName()}</div>
          <div className="text-xs text-gray-500">{formatDate(review.createdAt)}</div>
        </div>
        
        {canModify && (
          <div className="flex space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(review)}
                className="text-primary-600 hover:text-primary-800 text-sm"
              >
                Sửa
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(review._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Xóa
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};

export default ReviewItem; 