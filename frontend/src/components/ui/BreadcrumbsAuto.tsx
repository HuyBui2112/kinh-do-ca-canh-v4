"use client";

import { FC, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';

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

  return (
    <nav aria-label="Breadcrumbs" className={`py-3 ${className}`}>
      <ol className="flex items-center flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 hover:text-primary-600 flex items-center"
            >
              {showHomeIcon && (
                <Home className="h-4 w-4 mr-1" aria-hidden="true" />
              )}
              Trang chủ
            </Link>
          </li>
        )}

        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={item.slug} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" aria-hidden="true" />
              {isLast ? (
                <span className="font-medium text-sky-600" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.slug}
                  className="text-gray-500 hover:text-primary-600"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbsAuto; 