"use client";

import { FC } from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreadcrumbItem {
  /**
   * Slug của trang (đường dẫn URL)
   */
  slug: string;
  /**
   * Tên hiển thị cho trang
   */
  label: string;
}

interface BreadcrumbsProps {
  /**
   * Danh sách các breadcrumb tùy chỉnh
   * Mỗi breadcrumb gồm slug (đường dẫn) và label (tên hiển thị)
   */
  items: BreadcrumbItem[];
  /**
   * Có hiển thị icon home ở đầu breadcrumbs hay không
   * @default true
   */
  showHomeIcon?: boolean;
  /**
   * Có hiển thị liên kết trang chủ ở đầu breadcrumbs hay không
   * @default true
   */
  showHome?: boolean;
  /**
   * Class tùy chỉnh cho container
   */
  className?: string;
}

/**
 * Component hiển thị breadcrumbs dựa trên danh sách các trang được truyền vào
 * Cho phép điều hướng giữa các trang thông qua các liên kết
 * 
 * @example
 * // Sử dụng cơ bản
 * <Breadcrumbs items={[
 *   { slug: '/san-pham', label: 'Sản phẩm' },
 *   { slug: '/san-pham/ca-canh', label: 'Cá cảnh' },
 * ]} />
 * 
 * // Tùy chỉnh hiển thị
 * <Breadcrumbs 
 *   items={[{ slug: '/san-pham', label: 'Sản phẩm' }]} 
 *   showHomeIcon={false} 
 *   className="mb-8"
 * />
 */
const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  showHome = true,
  className = '',
}) => {
  // Nếu không có items và không hiển thị trang chủ, không hiển thị breadcrumbs
  if (!showHome && (!items || items.length === 0)) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav 
      aria-label="Breadcrumbs" 
      className={`py-3 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.ol 
        className="text-sm flex items-center flex-wrap"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {showHome && (
          <motion.li 
            className="flex items-center"
            variants={itemVariant}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                title="Trang chủ"
                className="text-gray-500 hover:text-sky-600 flex items-center"
              >
                {showHomeIcon && (
                  <Home className="h-4 w-4 mr-1" aria-hidden="true" />
                )}
                Trang chủ
              </Link>
            </motion.div>
          </motion.li>
        )}

        {items && items.map((breadcrumbItem, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <motion.li 
              key={breadcrumbItem.slug} 
              className="text-sm flex items-center"
              variants={itemVariant}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" aria-hidden="true" />
              </motion.span>
              {isLast ? (
                <motion.span 
                  className="font-medium text-sky-600" 
                  aria-current="page"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {breadcrumbItem.label}
                </motion.span>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={breadcrumbItem.slug}
                    title={breadcrumbItem.label}
                    className="text-gray-500 hover:text-sky-600"
                  >
                    {breadcrumbItem.label}
                  </Link>
                </motion.div>
              )}
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.nav>
  );
};

export default Breadcrumbs; 