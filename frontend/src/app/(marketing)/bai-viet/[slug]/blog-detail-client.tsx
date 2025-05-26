"use client";

import { useEffect } from "react";
import { useBlogs } from "@/hooks/useBlogs";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { Calendar, User, Tag } from "lucide-react";

interface BlogDetailClientProps {
  slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  const {
    blogDetail,
    detailLoading,
    detailError,
    blogs,
    fetchBlogBySlug,
    fetchBlogs,
  } = useBlogs();

  // Lấy chi tiết bài viết khi component mount
  useEffect(() => {
    fetchBlogBySlug(slug);
  }, [slug, fetchBlogBySlug]);

  // Lấy các bài viết liên quan khi có tags
  useEffect(() => {
    const tags = blogDetail?.tags;
    if (tags && tags.length > 0) {
      fetchBlogs({ tags, limit: 3 });
    }
  }, [blogDetail?._id, blogDetail?.tags, fetchBlogs]);

  if (detailLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (detailError || !blogDetail) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Có lỗi xảy ra: {detailError || "Không tìm thấy bài viết"}</p>
      </div>
    );
  }

  // Lọc ra các bài viết liên quan (không bao gồm bài hiện tại)
  const relatedBlogs = blogs.filter((blog) => blog._id !== blogDetail._id);

  return (
    <div className="container mx-auto px-4 pb-8">
      <Breadcrumbs
        items={[
          { slug: "/bai-viet", label: "Bài viết" },
          { slug: `/bai-viet/${blogDetail.slug}`, label: blogDetail.title },
        ]}
      />
      <motion.article
        className="max-w-4xl mx-auto bg-white mt-10 rounded-2xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Ảnh đại diện */}
        {blogDetail.blog_image && (
          <div className="relative w-full h-[200px]">
            <Image
              src={blogDetail.blog_image}
              alt={blogDetail.title}
              fill
              title={blogDetail.title}
              sizes="(max-width: 200px) 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

            {/* Tiêu đề bài viết overlay trên ảnh */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
                {blogDetail.title}
              </h1>

              {/* Meta thông tin */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{blogDetail.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(blogDetail.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-8">
          {/* Nếu không có ảnh, hiển thị tiêu đề ở đây */}
          {!blogDetail.blog_image && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-sky-700 mt-2 mb-4">
                {blogDetail.title}
              </h1>

              {/* Meta thông tin */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{blogDetail.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(blogDetail.publishedAt)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2 my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {blogDetail.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-sky-50 text-sky-600 text-sm rounded-full flex items-center gap-1.5 border border-sky-100 hover:bg-sky-100 transition-colors"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Nội dung bài viết sử dụng Markdown */}
          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom renderer cho images với thẻ img thông thường
                img: ({ ...props }) => {
                  // Kiểm tra và chuyển đổi kiểu dữ liệu
                  const src = typeof props.src === "string" ? props.src : "";

                  return (
                    <span className="block my-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={props.alt || "Ảnh bài viết"}
                        width="600"
                        height="300"
                        loading="lazy"
                        title={props.alt || "Ảnh bài viết"}
                        className="rounded-xl shadow-md w-[600px] max-w-3xl mx-auto h-auto object-contain hover:shadow-lg transition-shadow"
                      />
                      {props.alt && (
                        <span className="block text-sm text-gray-500 mt-3 text-center italic">
                          {props.alt}
                        </span>
                      )}
                    </span>
                  );
                },
                // Custom renderer cho headings
                h1: (props) => {
                  return (
                    <h1
                      className="text-2xl md:text-3xl font-bold text-sky-700 mt-10 mb-4 border-b border-sky-100 pb-2"
                      {...props}
                    />
                  );
                },
                h2: (props) => {
                  return (
                    <h2
                      className="text-xl md:text-2xl font-bold text-sky-700 mt-8 mb-4 border-b border-sky-100 pb-2"
                      {...props}
                    />
                  );
                },
                h3: (props) => {
                  return (
                    <h3
                      className="text-lg md:text-xl font-bold text-sky-700 mt-6 mb-3"
                      {...props}
                    />
                  );
                },
                // Custom renderer cho links
                a: (props) => {
                  return (
                    <a
                      className="text-sky-600 hover:text-sky-700 font-medium underline decoration-sky-200 hover:decoration-sky-500 underline-offset-2 transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  );
                },
                // Custom renderer cho paragraphs
                p: (props) => {
                  return (
                    <p
                      className="text-gray-700 leading-relaxed mb-4 text-justify"
                      {...props}
                    />
                  );
                },
                // Custom renderer cho danh sách
                ul: (props) => {
                  return (
                    <ul
                      className="list-disc pl-6 mb-6 space-y-2 marker:text-sky-500"
                      {...props}
                    />
                  );
                },
                li: (props) => {
                  return (
                    <li className="text-gray-700 leading-relaxed" {...props} />
                  );
                },
                // Custom renderer cho bold text
                strong: (props) => {
                  return (
                    <strong className="font-bold text-sky-800" {...props} />
                  );
                },
                // Custom renderer cho blockquote
                blockquote: (props) => {
                  return (
                    <blockquote
                      className="pl-4 border-l-4 border-sky-200 italic text-gray-700 my-6 bg-sky-50/50 py-3 pr-4 rounded-r-md"
                      {...props}
                    />
                  );
                },
              }}
            >
              {blogDetail.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </motion.article>

      {/* Bài viết liên quan */}
      {relatedBlogs.length > 0 && (
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-sky-700 mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-2/3 after:h-1 after:bg-gradient-to-r after:from-sky-500 after:to-sky-300 after:rounded-full">
            Bài viết liên quan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {relatedBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  href={`/bai-viet/${blog.slug}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      title={blog.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-lg font-semibold text-sky-700 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {blog.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {blog.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(blog.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
