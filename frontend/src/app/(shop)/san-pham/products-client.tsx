"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/ui/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { ProductQueryParams } from "@/utils/types";

// Các danh mục sản phẩm
const PRODUCT_CATEGORIES = [
  {
    slug: "ca-canh",
    title: "Cá cảnh"
  },
  {
    slug: "thuc-an",
    title: "Thức ăn"
  },
  {
    slug: "phu-kien",
    title: "Phụ kiện"
  },
  {
    slug: "thuoc",
    title: "Thuốc"
  },
  {
    slug: "be-ca",
    title: "Bể cá"
  }
];

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const { products, pagination, loading, error, getProducts } = useProducts();

  // Theo dõi sự thay đổi của searchParams
  const isFirstRender = useRef(true);

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
      if (sortBy) params.sortBy = sortBy as 'name' | 'price' | 'rating';
      if (sortOrder) params.sortOrder = sortOrder as 'asc' | 'desc';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 text-sm"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-primary-600 text-sm">Sản phẩm</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bộ lọc */}
        <div className="lg:w-1/4">
          <ProductFilters
            categories={PRODUCT_CATEGORIES}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Danh sách sản phẩm */}
        <div className="lg:w-3/4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-500 mb-4">
                Không có sản phẩm nào phù hợp với bộ lọc bạn đã chọn.
              </p>
              <button
                onClick={() => handleFilterChange({})}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Thông tin số sản phẩm và phân trang */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  Hiển thị{" "}
                  {pagination.page * pagination.limit - pagination.limit + 1}-
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  trên {pagination.total} sản phẩm
                </p>
              </div>

              {/* Grid sản phẩm */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Phân trang */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="flex items-center">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 rounded-md mr-2 border text-gray-600 disabled:opacity-50"
                    >
                      &lt; Trước
                    </button>

                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 mx-1 rounded-md ${
                          pagination.page === i + 1
                            ? "bg-primary-600 text-white"
                            : "border text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-2 rounded-md ml-2 border text-gray-600 disabled:opacity-50"
                    >
                      Sau &gt;
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
