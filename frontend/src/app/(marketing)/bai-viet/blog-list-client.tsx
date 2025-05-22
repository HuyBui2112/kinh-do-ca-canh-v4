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
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Có lỗi xảy ra: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <Breadcrumbs items={[{ slug: "/bai-viet", label: "Bài viết" }]} />
      {/* Tiêu đề trang */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-sky-700 mt-4 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-2/3 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-sky-300 after:rounded-full">
          Bài viết về cá cảnh
        </h1>
      </motion.div>

      <div className="pt-4">
        {/* Bộ lọc */}
        <motion.div
          className="mb-8 py-5 px-6 flex flex-wrap justify-between gap-4 items-center border-b border-sky-900/20 bg-white rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-sm font-medium text-sky-800 flex items-center gap-2">
            <Filter size={16} className="text-sky-500" />
            Hiện có{" "}
            <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-md font-semibold">
              {pagination.total}
            </span>{" "}
            bài viết
          </p>
          <div className="flex flex-wrap justify-between gap-6 items-center">
            <div className="flex items-center gap-2 bg-sky-50/50 rounded-lg px-3 py-2">
              <label className="text-sm font-medium text-sky-700">
                Sắp xếp theo:
              </label>
              <div className="relative">
                <select
                  className="appearance-none bg-white border rounded-md px-3 py-1.5 text-sm pr-8 text-sky-800 border-sky-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none transition-colors shadow-sm"
                  value={`${queryParams.sortBy}-${queryParams.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    fetchBlogs({
                      ...queryParams,
                      sortBy: sortBy as "publishedAt" | "title",
                      sortOrder: sortOrder as "asc" | "desc",
                    });
                  }}
                >
                  <option value="publishedAt-desc">Mới nhất</option>
                  <option value="publishedAt-asc">Cũ nhất</option>
                  <option value="title-asc">A-Z</option>
                  <option value="title-desc">Z-A</option>
                </select>
                <ChevronDown
                  size={14}
                  className="text-sky-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 bg-sky-50/50 rounded-lg px-3 py-2">
              <label className="text-sm font-medium text-sky-700">
                Hiển thị:
              </label>
              <div className="relative">
                <select
                  className="appearance-none bg-white border rounded-md px-3 py-1.5 text-sm pr-8 text-sky-800 border-sky-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-300 outline-none transition-colors shadow-sm"
                  value={queryParams.limit}
                  onChange={(e) => changeLimit(Number(e.target.value))}
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
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogs.map((blog) => (
            <motion.div key={blog._id} variants={itemVariants}>
              <Link
                href={`/bai-viet/${blog.slug}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-80 transition-opacity"></div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold text-sky-700 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.title}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-sky-50 text-sky-600 text-xs rounded-full border border-sky-100"
                      >
                        {tag}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                        +{blog.tags.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-3 border-t border-sky-50">
                    <span className="flex items-center gap-1">
                      <User size={14} className="text-sky-400" />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-sky-400" />
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
          >
            <div className="inline-flex rounded-lg shadow-sm overflow-hidden">
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <motion.button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-5 py-3 rounded-none ${
                    page === pagination.page
                      ? "bg-sky-600 text-white font-medium"
                      : "bg-white text-gray-700 hover:bg-sky-50 border-r border-gray-200"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
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
