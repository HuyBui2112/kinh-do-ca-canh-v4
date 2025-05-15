"use client";

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductListItem } from '../../utils/types';
import { formatCurrency } from '../../utils/helpers';

interface ProductCardProps {
  product: ProductListItem;
}

/**
 * Component hiển thị thông tin sản phẩm trong danh sách
 */
const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const {
    name,
    slug,
    imageFirst,
    price,
    avgRating,
    numReviews
  } = product;

  const discountPercent = price.discount > 0 
    ? Math.round(price.discount) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/san-pham/${slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageFirst || '/images/product-placeholder.jpg'}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/san-pham/${slug}`} className="no-underline">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            {price.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(price.origin_price)}
              </span>
            )}
            <span className="text-lg font-bold text-primary-600">
              {formatCurrency(price.sell_price)}
            </span>
          </div>
          <Link 
            href={`/san-pham/${slug}`}
            className="bg-primary-600 hover:bg-primary-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 