"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductListItem } from "../../utils/types";
import { formatCurrency } from "../../utils/helpers";
import { useCart } from "@/contexts/CartContext";
import { Loader2, ShoppingCart, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: ProductListItem;
}

/**
 * Component hiển thị thông tin sản phẩm trong danh sách
 */
const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { name, slug, imageFirst, price, avgRating, numReviews, _id } = product;
  const { addToCart, isProductInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discountPercent = price.discount > 0 ? Math.round(price.discount) : 0;

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    setIsAdding(true);
    setError(null);
    try {
      const success = await addToCart(_id, 1);
      if (!success) {
        setError("Không thể thêm vào giỏ hàng");
      }
    } catch (err) {
      setError("Lỗi khi thêm vào giỏ hàng");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const productInCart = isProductInCart(_id);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <Link href={`/san-pham/${slug}`}>
        <motion.div 
          className="relative h-48 w-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={imageFirst || "/images/product-placeholder.jpg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {discountPercent > 0 && (
            <motion.div 
              className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              -{discountPercent}%
            </motion.div>
          )}
        </motion.div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/san-pham/${slug}`} className="no-underline">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-sky-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <motion.svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({numReviews})</span>
        </div>

        <div className="mt-auto">
          <motion.div 
            className="flex items-center justify-between mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col">
              {price.discount > 0 ? (
                <motion.span 
                  className="text-sm text-gray-500 line-through"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {formatCurrency(price.origin_price)}
                </motion.span>
              ) : (
                <span className="text-sm text-transparent">.</span>
              )}
              <motion.span 
                className="text-lg font-bold text-sky-600"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {formatCurrency(price.sell_price)}
              </motion.span>
            </div>
          </motion.div>
          
          {error && (
            <motion.div 
              className="text-red-500 text-sm mb-2 flex items-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle className="w-4 h-4 mr-1" /> {error}
            </motion.div>
          )}
          
          <div className="flex space-x-2 mt-2">
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding || productInCart}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                productInCart 
                  ? "bg-green-50 text-green-600 border border-green-600" 
                  : "bg-white hover:bg-amber-50 text-amber-600 border border-amber-600"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : productInCart ? (
                <>
                  <ShoppingCart className="w-4 h-4 mr-1" /> Đã thêm
                </>
              ) : (
                "Thêm vào giỏ"
              )}
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                href={productInCart ? "/gio-hang" : `/san-pham/${slug}`}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors text-center block w-full"
              >
                {productInCart ? "Xem giỏ hàng" : "Mua ngay"}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
