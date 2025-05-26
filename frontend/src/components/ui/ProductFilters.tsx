"use client";

import { FC, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductQueryParams } from "../../utils/types";
import { motion, AnimatePresence } from "framer-motion";
// Import các icon cần thiết từ lucide-react
import {
  Filter,
  ListChecks,
  DollarSign,
  PackageCheck,
  ArrowUpDown,
  Trash2,
  XIcon,
} from "lucide-react";

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
  initialFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductQueryParams>(
    initialFilters || {}
  );

  // Lấy các tham số lọc từ URL khi component được tải hoặc URL thay đổi
  useEffect(() => {
    // Tạo một bản sao của searchParams để có thể đọc nhiều lần mà không gặp vấn đề
    const currentParams = new URLSearchParams(searchParams.toString());

    const newFiltersFromUrl: ProductQueryParams = {};

    const category = currentParams.get("category");
    const minPriceParam = currentParams.get("minPrice");
    const maxPriceParam = currentParams.get("maxPrice");
    const inStockParam = currentParams.get("inStock");
    const sortByParam = currentParams.get("sortBy");
    const sortOrderParam = currentParams.get("sortOrder");
    const pageParam = currentParams.get("page"); // Đọc cả page từ URL

    if (category) newFiltersFromUrl.category = category;
    if (minPriceParam) newFiltersFromUrl.minPrice = parseInt(minPriceParam);
    if (maxPriceParam) newFiltersFromUrl.maxPrice = parseInt(maxPriceParam);
    if (inStockParam) newFiltersFromUrl.inStock = inStockParam === "true";
    if (sortByParam)
      newFiltersFromUrl.sortBy = sortByParam as "name" | "price" | "rating";
    if (sortOrderParam)
      newFiltersFromUrl.sortOrder = sortOrderParam as "asc" | "desc";
    if (pageParam) newFiltersFromUrl.page = parseInt(pageParam);
    // Các trường không có trong URL sẽ không được thêm vào newFiltersFromUrl,
    // do đó khi setFilters(newFiltersFromUrl), các trường đó sẽ bị xóa khỏi state.

    // Chỉ cập nhật state nếu object filter mới từ URL thực sự khác với state hiện tại
    if (JSON.stringify(newFiltersFromUrl) !== JSON.stringify(filters)) {
      setFilters(newFiltersFromUrl); // GHI ĐÈ HOÀN TOÀN, không merge
    }
    // Bỏ `filters` khỏi dependency array nếu không muốn useEffect này chạy lại sau khi chính nó setFilters.
    // Tuy nhiên, để JSON.stringify(filters) ở trên hoạt động đúng khi so sánh, `filters` nên là dependency.
    // React sẽ xử lý để không gây vòng lặp vô hạn nếu `setFilters` được gọi với cùng một giá trị.
    // Trong trường hợp này, `searchParams` là primary trigger.
  }, [searchParams, filters]); // Thêm filters vào dependencies để so sánh chính xác

  // Áp dụng bộ lọc và cập nhật URL
  const applyFilters = (newFilters: ProductQueryParams) => {
    setFilters(newFilters); // Cập nhật state nội bộ ngay lập tức
    onFilterChange(newFilters); // Gọi callback để component cha xử lý (ví dụ: gọi API)

    // Cập nhật URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        params.set(key, String(value));
      }
    });

    const newUrl =
      "/san-pham" + (params.toString() ? `?${params.toString()}` : "");
    router.push(newUrl, { scroll: false }); // Thêm { scroll: false } để không cuộn lên đầu trang
  };

  // Xử lý thay đổi loại sản phẩm
  const handleCategoryChange = (categorySlug: string) => {
    applyFilters({
      ...filters,
      category: filters.category === categorySlug ? undefined : categorySlug,
      page: 1, // Reset về trang 1 khi thay đổi category
    });
  };

  // Xóa bộ lọc danh mục cụ thể
  const clearCategoryFilter = () => {
    applyFilters({
      ...filters,
      category: undefined,
      page: 1, // Reset về trang 1
    });
  };

  // Xử lý thay đổi khoảng giá
  const handlePriceRangeChange = (min?: number, max?: number) => {
    applyFilters({
      ...filters,
      minPrice: min,
      maxPrice: max,
      page: 1, // Reset về trang 1
    });
  };

  // Xử lý thay đổi trạng thái còn hàng
  const handleInStockChange = (checked: boolean) => {
    applyFilters({
      ...filters,
      inStock: checked ? true : undefined, // Gửi undefined nếu không check để loại bỏ khỏi query
      page: 1, // Reset về trang 1
    });
  };

  // Xử lý thay đổi cách sắp xếp
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    applyFilters({
      ...filters,
      sortBy: sortBy as "name" | "price" | "rating", // Nên dùng kiểu cụ thể
      sortOrder: sortOrder as "asc" | "desc", // Nên dùng kiểu cụ thể
      page: 1, // Reset về trang 1
    });
  };

  // Xóa tất cả bộ lọc
  const clearAllFilters = () => {
    applyFilters({ page: 1 }); // Chỉ giữ lại page 1 hoặc hoàn toàn rỗng tùy logic
    // Nếu muốn xóa hoàn toàn params kể cả page: applyFilters({});
  };

  // Tạo giá trị cho sortBy-sortOrder
  const getSortValue = () => {
    if (!filters.sortBy) return "";
    return `${filters.sortBy}-${filters.sortOrder || "asc"}`;
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-5 sticky top-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 25 }}
    >
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200">
        <motion.h2
          className="text-xl font-semibold text-gray-900 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Filter size={20} className="mr-2 text-sky-600" />
          Bộ lọc
        </motion.h2>
        <button
          onClick={clearAllFilters}
          className="text-xs font-medium text-rose-600 hover:text-rose-800 transition-colors flex items-center"
          aria-label="Xóa tất cả bộ lọc"
        >
          <Trash2 size={14} className="mr-1" />
          Xóa tất cả
        </button>
      </div>

      {/* Loại sản phẩm */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
          <ListChecks size={18} className="mr-2 text-sky-500" />
          Loại sản phẩm
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="flex items-center justify-between group"
            >
              <label
                htmlFor={`category-${category.slug}`}
                className="flex items-center cursor-pointer text-sm text-gray-700 hover:text-sky-700 transition-colors w-full"
              >
                <input
                  type="checkbox"
                  id={`category-${category.slug}`}
                  checked={filters.category === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 mr-2.5"
                />
                {category.title}
              </label>
              <AnimatePresence>
                {filters.category === category.slug && (
                  <button
                    onClick={clearCategoryFilter}
                    className="text-gray-400 hover:text-rose-600 transition-colors"
                    aria-label={`Xóa bộ lọc ${category.title}`}
                  >
                    <XIcon size={16} />
                  </button>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Khoảng giá */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
          <DollarSign size={18} className="mr-2 text-sky-500" />
          Khoảng giá
        </h3>
        <div className="flex space-x-2 items-center">
          <div className="flex-1">
            <input
              type="number"
              id="min-price"
              min="0"
              step="10000"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handlePriceRangeChange(
                  e.target.value ? parseInt(e.target.value) : undefined,
                  filters.maxPrice
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              placeholder="Từ 0đ"
            />
          </div>
          <span className="text-gray-400">–</span>
          <div className="flex-1">
            <input
              type="number"
              id="max-price"
              min={filters.minPrice ? filters.minPrice + 10000 : 0}
              step="10000"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handlePriceRangeChange(
                  filters.minPrice,
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              placeholder="Đến..."
            />
          </div>
        </div>
      </div>

      {/* Tình trạng */}
      <div className="mb-5">
        <p className="text-base font-semibold text-gray-800 mb-3 flex items-center">
          <PackageCheck size={18} className="mr-2 text-sky-500" />
          Tình trạng
        </p>
        <label
          htmlFor="in-stock"
          className="flex items-center cursor-pointer text-sm text-gray-700 hover:text-sky-700 transition-colors group w-fit"
        >
          <input
            type="checkbox"
            id="in-stock"
            checked={!!filters.inStock} // Đảm bảo checked là boolean
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 mr-2.5"
          />
          Chỉ hiển thị sản phẩm còn hàng
        </label>
      </div>

      {/* Sắp xếp */}
      <div>
        <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
          <ArrowUpDown size={18} className="mr-2 text-sky-500" />
          Sắp xếp theo
        </h3>
        <div className="relative">
          <select
            value={getSortValue()}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full p-2.5 pr-10 border border-gray-300 rounded-md text-sm appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-colors"
          >
            <option value="">Mặc định</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="rating-desc">Đánh giá cao nhất</option>
            {/* Thêm các tùy chọn sắp xếp khác nếu cần */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductFilters;
