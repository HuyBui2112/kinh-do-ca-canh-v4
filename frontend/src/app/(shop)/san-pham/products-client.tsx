"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Filter,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/ui/ProductFilters";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useProducts } from "@/hooks/useProducts";
import { ProductQueryParams } from "@/utils/types";
import { motion } from "framer-motion";

// Các danh mục sản phẩm
export const PRODUCT_CATEGORIES = [
  {
    slug: "ca-canh",
    title: "Cá cảnh",
  },
  {
    slug: "thuc-an",
    title: "Thức ăn",
  },
  {
    slug: "phu-kien",
    title: "Phụ kiện",
  },
  {
    slug: "thuoc",
    title: "Thuốc",
  },
  {
    slug: "be-ca",
    title: "Bể cá",
  },
];

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const { products, pagination, loading, error, getProducts } = useProducts();

  // Theo dõi sự thay đổi của searchParams
  const isFirstRender = useRef(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // Lấy các tham số từ URL
  useEffect(() => {
    // Hàm để xử lý tham số từ URL
    const fetchProducts = () => {
      const params: ProductQueryParams = {};

      const page = searchParams.get("page");
      const category = searchParams.get("category");
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      const inStock = searchParams.get("inStock");
      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");

      if (page) params.page = parseInt(page);
      if (category) params.category = category;
      if (minPrice) params.minPrice = parseInt(minPrice);
      if (maxPrice) params.maxPrice = parseInt(maxPrice);
      if (inStock) params.inStock = inStock === "true";
      if (sortBy) params.sortBy = sortBy as "name" | "price" | "rating";
      if (sortOrder) params.sortOrder = sortOrder as "asc" | "desc";

      getProducts(params);
    };

    // Kiểm tra nếu đây là lần render đầu tiên
    if (isFirstRender.current) {
      fetchProducts();
      isFirstRender.current = false;
    } else {
      // Tạo một timeout để tránh nhiều lần gọi API trong thời gian ngắn
      const timer = setTimeout(() => {
        fetchProducts();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [searchParams, getProducts]); // Thêm getProducts vào dependencies

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filters: ProductQueryParams) => {
    // Cập nhật URL với các filter mới
    const params = new URLSearchParams();

    if (filters.page) params.set("page", filters.page.toString());
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.inStock !== undefined)
      params.set("inStock", filters.inStock.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

    window.history.pushState(null, "", `/san-pham?${params.toString()}`);
    // Không gọi getProducts ở đây, nó sẽ được gọi trong useEffect khi URL thay đổi
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    window.history.pushState(null, "", `/san-pham?${params.toString()}`);
    // Không gọi getProducts ở đây, nó sẽ được gọi trong useEffect khi URL thay đổi
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <div className="flex flex-col">
        <Breadcrumbs items={[{ slug: "/san-pham", label: "Tất Cả Sản Phẩm" }]} />
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-sky-700 mt-4 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-2/3 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-sky-300 after:rounded-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Khám Phá Sản Phẩm
        </motion.h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bộ lọc */}
        <motion.div
          className="lg:w-1/4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-md p-5 border border-sky-100/30 sticky top-24">
            <div className="flex items-center gap-2 text-sky-700 font-medium border-b border-sky-100 pb-3 mb-4">
              <SlidersHorizontal size={18} />
              <span>Tinh Chỉnh Tìm Kiếm</span>
            </div>
            <ProductFilters
              categories={PRODUCT_CATEGORIES}
              onFilterChange={handleFilterChange}
            />
          </div>
        </motion.div>

        {/* Danh sách sản phẩm */}
        <motion.div
          className="lg:w-3/4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {error && (
            <motion.div
              className="bg-red-50 border border-red-200 text-rose-600 p-6 rounded-xl mb-6 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
            </div>
          ) : products.length === 0 ? (
            <motion.div
              className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                Rất Tiếc, Không Tìm Thấy Sản Phẩm Phù Hợp
              </h3>
              <p className="text-gray-500 mb-6">
                Có vẻ như không có sản phẩm nào khớp với lựa chọn của bạn. Vui lòng thử điều chỉnh bộ lọc hoặc xóa bớt tiêu chí tìm kiếm.
              </p>
              <motion.button
                onClick={() => handleFilterChange({ page: 1 })}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-rose-500 text-sm font-medium rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors shadow-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={16} className="mr-2" />
                Xóa Bộ Lọc & Tìm Lại
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Thông tin số sản phẩm và phân trang */}
              <motion.div
                className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-sky-100/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="hidden min-[550px]:flex items-center gap-2">
                  <Filter size={16} className="text-sky-500" />
                  <p className="text-sm text-sky-700">
                    Hiển thị từ
                    <span className="font-medium">
                      {" "}{pagination.page * pagination.limit -
                        pagination.limit +
                        1}
                      {" "}-{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>
                    {" "}trên tổng số <span className="font-medium">{pagination.total}</span>
                    {" "}sản phẩm
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-sky-50/50 rounded-lg px-3 py-2">
                  <label className="text-sm font-medium text-sky-700">
                    Sắp xếp theo:
                  </label>
                  <div className="relative">
                    <select
                      className="appearance-none bg-white border rounded-md px-3 py-1.5 text-sm pr-8 text-sky-800 border-sky-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none transition-colors shadow-sm"
                      value={`${searchParams.get("sortBy") || "rating"}-${searchParams.get("sortOrder") || "desc"}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split("-");
                        handleFilterChange({
                          ...Object.fromEntries(
                            Array.from(searchParams.entries())
                          ),
                          sortBy: sortBy as "name" | "price" | "rating",
                          sortOrder: sortOrder as "asc" | "desc",
                        });
                      }}
                      aria-label="Tiêu chí sắp xếp sản phẩm"
                    >
                      <option value="rating-desc">Nổi bật (Đánh giá)</option>
                      <option value="price-asc">Giá: Thấp đến Cao</option>
                      <option value="price-desc">Giá: Cao đến Thấp</option>
                      <option value="name-asc">Tên: A đến Z</option>
                      <option value="name-desc">Tên: Z đến A</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="text-sky-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Grid sản phẩm */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product) => (
                  <motion.div key={product._id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Phân trang */}
              {pagination.totalPages >= 1 && products.length > 0 && (
                <motion.div
                  className="flex justify-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <nav className="flex items-center shadow-sm rounded-lg overflow-hidden" aria-label="Phân trang danh sách sản phẩm">
                    <motion.button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="w-10 h-10 flex items-center justify-center text-sm rounded-none mr-px border border-r-0 text-sky-700 disabled:opacity-50 bg-white hover:enabled:bg-sky-50 transition-colors duration-200 ease-in-out disabled:bg-gray-50"
                      aria-label="Đi đến trang trước"
                      whileHover={{ scale: pagination.page === 1 ? 1 : 1.05 }}
                      whileTap={{ scale: pagination.page === 1 ? 1 : 0.95 }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 text-sm rounded-none transition-colors duration-200 ease-in-out border-r border-t border-b ${pagination.page === i + 1
                            ? "bg-sky-600 text-white border-sky-600"
                            : "border text-sky-700 hover:bg-sky-50 bg-white"
                          }`}
                        aria-label={`Đi đến trang ${i + 1}`}
                        aria-current={pagination.page === i + 1 ? "page" : undefined}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {i + 1}
                      </motion.button>
                    ))}

                    <motion.button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="w-10 h-10 flex items-center justify-center text-sm rounded-none ml-px border border-l-0 text-sky-700 disabled:opacity-50 bg-white hover:enabled:bg-sky-50 transition-colors duration-200 ease-in-out disabled:bg-gray-50"
                      aria-label="Đi đến trang sau"
                      whileHover={{
                        scale:
                          pagination.page === pagination.totalPages ? 1 : 1.05,
                      }}
                      whileTap={{
                        scale:
                          pagination.page === pagination.totalPages ? 1 : 0.95,
                      }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </nav>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
