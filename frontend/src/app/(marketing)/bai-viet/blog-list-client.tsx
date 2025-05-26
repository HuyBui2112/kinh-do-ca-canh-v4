"use client";

import { useEffect } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { motion } from "framer-motion";
import { User, Calendar, Filter, ChevronDown } from "lucide-react";

export default function BlogListClient() {
  const {
    blogs,
    loading,
    error,
    pagination,
    queryParams,
    fetchBlogs,
    goToPage,
    changeLimit,
  } = useBlogs();

  // Xử lý khi component mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        <p className="ml-4 text-sky-600 text-lg">
          Đang tải danh sách bài viết...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-2">
          Rất Tiếc, Đã Có Lỗi Xảy Ra
        </h3>
        <p className="text-gray-700">
          Không thể tải danh sách bài viết vào lúc này. Vui lòng thử lại sau.
        </p>
        <p className="mt-2 text-sm text-gray-500">Chi tiết lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <Breadcrumbs
        items={[{ slug: "/bai-viet", label: "Góc Chia Sẻ Kiến Thức" }]}
      />
      {/* Tiêu đề trang */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-sky-700 mt-4 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-2/3 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-sky-300 after:rounded-full">
          Kho Tàng Kiến Thức Thủy Sinh
        </h1>
        <div className="px-6 py-4 bg-sky-50 rounded-lg border-l-4 border-sky-500 shadow-sm">
          <p className="text-gray-600 text-justify leading-relaxed">
            Chào mừng bạn đến với chuyên mục chia sẻ kiến thức từ{" "}
            <strong className="text-sky-600">Kinh Đô Cá Cảnh!</strong> Nơi đây
            là kho tàng thông tin bổ ích, những mẹo hay và kinh nghiệm thực tế
            về thế giới cá cảnh đa sắc màu. Từ cách chọn lựa các loài cá phù
            hợp, kỹ thuật chăm sóc chuyên sâu, bí quyết xử lý các vấn đề thường
            gặp, cho đến những đánh giá chi tiết về sản phẩm mới nhất trên thị
            trường - tất cả đều được chúng tôi tổng hợp và cập nhật thường
            xuyên. Hãy cùng khám phá và làm phong phú thêm hành trình nuôi cá
            của bạn!
          </p>
        </div>
      </motion.div>

      <div className="pt-8">
        {/* Bộ lọc và thông tin */}
        <motion.div
          className="mb-8 py-4 px-6 flex flex-wrap justify-between gap-y-4 items-center border-b border-t border-sky-200 bg-white rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-sm font-medium text-sky-800 flex items-center gap-2">
            <Filter size={16} className="text-sky-500" />
            Tìm thấy
            <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-md font-semibold">
              {pagination.total}
            </span>
            bài viết hữu ích
          </p>
          <div className="flex flex-wrap justify-end gap-x-6 gap-y-3 items-center">
            <div className="flex items-center gap-2 bg-sky-50/60 rounded-lg px-3 py-2 border border-sky-100">
              <label
                htmlFor="sort-blogs"
                className="text-sm font-medium text-sky-700 whitespace-nowrap"
              >
                Sắp xếp theo:
              </label>
              <div className="relative">
                <select
                  id="sort-blogs"
                  className="appearance-none bg-white border rounded-md px-3 py-1.5 text-sm pr-8 text-sky-800 border-sky-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none transition-colors shadow-sm cursor-pointer"
                  value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    fetchBlogs({
                      ...queryParams,
                      page: 1,
                      sortBy: sortBy as "publishedAt" | "title",
                      sortOrder: sortOrder as "asc" | "desc",
                    });
                  }}
                  aria-label="Tiêu chí sắp xếp bài viết"
                >
                  <option value="publishedAt-desc">Mới nhất trước</option>
                  <option value="publishedAt-asc">Cũ nhất trước</option>
                  <option value="title-asc">Tiêu đề: A-Z</option>
                  <option value="title-desc">Tiêu đề: Z-A</option>
                </select>
                <ChevronDown
                  size={14}
                  className="text-sky-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-sky-50/60 rounded-lg px-3 py-2 border border-sky-100">
              <label
                htmlFor="limit-blogs"
                className="text-sm font-medium text-sky-700 whitespace-nowrap"
              >
                Hiển thị mỗi trang:
              </label>
              <div className="relative">
                <select
                  id="limit-blogs"
                  className="appearance-none bg-white border rounded-md px-3 py-1.5 text-sm pr-8 text-sky-800 border-sky-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none transition-colors shadow-sm cursor-pointer"
                  value={queryParams.limit}
                  onChange={(e) => changeLimit(Number(e.target.value))}
                  aria-label="Số lượng bài viết hiển thị mỗi trang"
                >
                  <option value="5">5 bài</option>
                  <option value="10">10 bài</option>
                  <option value="20">20 bài</option>
                </select>
                <ChevronDown
                  size={14}
                  className="text-sky-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danh sách bài viết */}
        {blogs.length === 0 && !loading && (
          <motion.div
            className="text-center py-12 bg-gray-50 rounded-lg shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Không Tìm Thấy Bài Viết Nào
            </h3>
            <p className="text-gray-500">
              Hiện tại chưa có bài viết nào phù hợp với lựa chọn của bạn. <br />
              Vui lòng quay lại sau hoặc thử tìm kiếm với tiêu chí khác.
            </p>
          </motion.div>
        )}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              variants={itemVariants}
              className="h-full"
            >
              <Link
                href={`/bai-viet/${blog.slug}`}
                title={`Đọc ngay: ${blog.title}`}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-sky-100/70 overflow-hidden"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={`Hình ảnh minh họa cho bài viết ${blog.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    placeholder="blur"
                    title={blog.title}
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                  {blog.tags && blog.tags.length > 0 && (
                    <span className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                      {blog.tags[0]}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h2 className="text-lg xl:text-xl font-semibold text-sky-800 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors duration-300">
                    {blog.title}
                  </h2>
                  <div className="flex flex-wrap gap-x-2 gap-y-1.5 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-sky-100 text-sky-700 text-xs rounded-full border border-sky-200 font-medium group-hover:bg-sky-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full border border-gray-200 font-medium">
                        +{blog.tags.length - 3} khác
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-3 border-t border-sky-100">
                    <span className="flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                      <User size={13} className="text-sky-500" />
                      {blog.author || "Admin"}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                      <Calendar size={13} className="text-sky-500" />
                      {formatDate(blog.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Phân trang */}
        {pagination.totalPages > 1 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            aria-label="Phân trang danh sách bài viết"
          >
            <div className="inline-flex rounded-lg shadow-md overflow-hidden border border-gray-200">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 h-10 md:px-5 md:h-11 text-sm font-medium rounded-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 relative ${
                    page === pagination.page
                      ? "bg-sky-600 text-white shadow-inner-sky hover:bg-sky-700"
                      : "bg-white text-sky-700 hover:bg-sky-50 border-r border-gray-200 last:border-r-0"
                  }`}
                  aria-label={`Đi đến trang ${page}`}
                  aria-current={page === pagination.page ? "page" : undefined}
                  whileHover={{ y: page === pagination.page ? 0 : -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {page}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
