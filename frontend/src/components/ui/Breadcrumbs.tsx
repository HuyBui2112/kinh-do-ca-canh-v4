"use client";

import { FC } from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

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

  return (
    <nav aria-label="Breadcrumbs" className={`py-3 ${className}`}>
      <ol className="text-sm flex items-center flex-wrap">
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

        {items && items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.slug} className="text-sm flex items-center">
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

export default Breadcrumbs; 