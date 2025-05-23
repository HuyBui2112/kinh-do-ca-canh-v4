"use client";

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Định nghĩa kiểu mapping giữa slug và tên hiển thị
interface SlugLabelMapping {
  [key: string]: string;
}

interface BreadcrumbsAutoProps {
  /**
   * Ánh xạ giữa slug và label tương ứng
   * @example { 'san-pham': 'Sản phẩm', 'ca-canh': 'Cá cảnh' }
   */
  mappings?: SlugLabelMapping;
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
 * Component hiển thị breadcrumbs tự động dựa trên đường dẫn URL hiện tại
 * Sử dụng mappings để chuyển đổi slug thành tên hiển thị
 * 
 * @example
 * // Sử dụng cơ bản
 * <BreadcrumbsAuto />
 * 
 * // Với mapping tùy chỉnh
 * <BreadcrumbsAuto 
 *   mappings={{ 
 *     'san-pham': 'Sản phẩm', 
 *     'ca-canh': 'Cá cảnh',
 *     'ca-vang': 'Cá vàng Ranchu'
 *   }} 
 * />
 */
const BreadcrumbsAuto: FC<BreadcrumbsAutoProps> = ({
  mappings = {},
  showHomeIcon = true,
  showHome = true,
  className = '',
}) => {
  const pathname = usePathname();

  // Mặc định mapping cho một số trang phổ biến
  const defaultMappings: SlugLabelMapping = {
    'san-pham': 'Sản phẩm',
    'gio-hang': 'Giỏ hàng',
    'thanh-toan': 'Thanh toán',
    'tai-khoan': 'Tài khoản',
    'dang-nhap': 'Đăng nhập',
    'dang-ky': 'Đăng ký',
    'tin-tuc': 'Tin tức',
    'lien-he': 'Liên hệ',
    ...mappings // Kết hợp với mappings do người dùng cung cấp
  };

  // Tạo breadcrumbs từ URL
  const breadcrumbs = useMemo(() => {
    // Bỏ qua ký tự / đầu tiên và chia đường dẫn thành các phần
    const segments = pathname.split('/').filter(Boolean);
    
    // Tạo mảng breadcrumbs với đường dẫn và nhãn
    return segments.map((segment, index) => {
      // Tạo đường dẫn cho breadcrumb này
      const slug = `/${segments.slice(0, index + 1).join('/')}`;
      
      // Lấy label từ mappings nếu có, nếu không thì chuyển đổi slug thành label
      const label = defaultMappings[segment] || 
        segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

      return { slug, label };
    });
  }, [pathname, defaultMappings]);

  // Nếu không có breadcrumbs và không hiển thị trang chủ, không hiển thị gì cả
  if (!showHome && breadcrumbs.length === 0) {
    return null;
  }

  // Animation variants
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
        className="flex items-center flex-wrap"
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

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <motion.li 
              key={item.slug} 
              className="flex items-center"
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
                  {item.label}
                </motion.span>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.slug}
                    className="text-gray-500 hover:text-sky-600"
                  >
                    {item.label}
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

export default BreadcrumbsAuto; 