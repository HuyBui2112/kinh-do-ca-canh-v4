"use client";

import { FC, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductQueryParams } from '../../utils/types';

// Định nghĩa kiểu dữ liệu cho danh mục
interface CategoryItem {
  slug: string;
  title: string;
}

interface ProductFiltersProps {
  categories: CategoryItem[];
  onFilterChange: (filters: ProductQueryParams) => void;
  initialFilters?: ProductQueryParams;
}

/**
 * Component hiển thị các bộ lọc sản phẩm
 */
const ProductFilters: FC<ProductFiltersProps> = ({ 
  categories, 
  onFilterChange,
  initialFilters
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<ProductQueryParams>(initialFilters || {});
  
  // Lấy các tham số lọc từ URL khi component được tải
  useEffect(() => {
    if (!searchParams) return;
    
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    
    const newFilters: ProductQueryParams = {};
    
    if (category) newFilters.category = category;
    if (minPrice) newFilters.minPrice = parseInt(minPrice);
    if (maxPrice) newFilters.maxPrice = parseInt(maxPrice);
    if (inStock) newFilters.inStock = inStock === 'true';
    if (sortBy) newFilters.sortBy = sortBy as any;
    if (sortOrder) newFilters.sortOrder = sortOrder as any;
    
    setFilters(newFilters);
  }, [searchParams]);
  
  // Áp dụng bộ lọc và cập nhật URL
  const applyFilters = (newFilters: ProductQueryParams) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Cập nhật URL với các bộ lọc mới
    const params = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    
    const newUrl = '/san-pham' + (params.toString() ? `?${params.toString()}` : '');
    router.push(newUrl);
  };
  
  // Xử lý thay đổi loại sản phẩm
  const handleCategoryChange = (category: string) => {
    applyFilters({
      ...filters,
      category: filters.category === category ? undefined : category
    });
  };
  
  // Xử lý thay đổi khoảng giá
  const handlePriceRangeChange = (min?: number, max?: number) => {
    applyFilters({
      ...filters,
      minPrice: min,
      maxPrice: max
    });
  };
  
  // Xử lý thay đổi trạng thái còn hàng
  const handleInStockChange = (checked: boolean) => {
    applyFilters({
      ...filters,
      inStock: checked
    });
  };
  
  // Xử lý thay đổi cách sắp xếp
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    applyFilters({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    });
  };
  
  // Xóa tất cả bộ lọc
  const clearAllFilters = () => {
    applyFilters({});
  };
  
  // Tạo giá trị cho sortBy-sortOrder
  const getSortValue = () => {
    if (!filters.sortBy) return '';
    return `${filters.sortBy}-${filters.sortOrder || 'asc'}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Loại sản phẩm</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.slug} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.slug}`}
                checked={filters.category === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor={`category-${category.slug}`}
                className="ml-2 text-sm text-gray-700"
              >
                {category.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Khoảng giá</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-price" className="text-xs text-gray-500">
              Từ
            </label>
            <input
              type="number"
              id="min-price"
              min="0"
              step="10000"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceRangeChange(
                e.target.value ? parseInt(e.target.value) : undefined, 
                filters.maxPrice
              )}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="0 đ"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="text-xs text-gray-500">
              Đến
            </label>
            <input
              type="number"
              id="max-price"
              min="0"
              step="10000"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceRangeChange(
                filters.minPrice, 
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              placeholder="10,000,000 đ"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="in-stock"
            checked={filters.inStock || false}
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
            Chỉ hiển thị sản phẩm còn hàng
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sắp xếp theo</h3>
        <select
          value={getSortValue()}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        >
          <option value="">Mặc định</option>
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="price-asc">Giá thấp đến cao</option>
          <option value="price-desc">Giá cao đến thấp</option>
          <option value="rating-desc">Đánh giá cao nhất</option>
        </select>
      </div>

      <button
        onClick={clearAllFilters}
        className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition-colors"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
};

export default ProductFilters; 