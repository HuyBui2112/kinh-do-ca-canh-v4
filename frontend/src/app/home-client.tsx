"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apis } from "@/services/apis";
import { ProductListItem, BlogSummary } from "@/utils/types";
import ProductCard from "@/components/ui/ProductCard";
import { formatDate } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { ArrowRight, Award, Droplets, Fish, ShoppingBag } from "lucide-react";

export default function HomeClient() {
  // State cho sản phẩm và bài viết
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);

  // Lấy sản phẩm và bài viết khi mount
  useEffect(() => {
    apis
      .getProducts({ limit: 5, sortBy: "rating", sortOrder: "desc" })
      .then((res) => {
        if (res.success && res.data?.products) setProducts(res.data.products);
      });
    apis
      .getBlogs({ limit: 4, sortBy: "publishedAt", sortOrder: "desc" })
      .then((res) => {
        if (res.success && res.data?.blogs) setBlogs(res.data.blogs);
      });
  }, []);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="container mx-auto">
      {/* Banner */}
      <div className="hidden lg:flex">
        <div className="relative lg:w-full lg:h-[189px] xl:h-[238px] 2xl:h-[288px]">
          <Image
            src="/images/banners/banner-main.png"
            alt="Kinh Đô Cá Cảnh - Thế giới thủy sinh trong tầm tay"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 1024px, 1504px"
            quality={85}
            className="object-cover w-full h-full"
            title="Khám Phá Kinh Đô Cá Cảnh - Nơi Đam Mê Bất Tận"
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/40 to-transparent"></div>
          <div className="absolute right-16 top-1/2 -translate-y-1/2 max-w-lg text-right">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-white lg:text-xl xl:text-2xl 2xl:text-3xl font-bold mb-4 drop-shadow-md">
                Kinh Đô Cá Cảnh - Uy Tín Tạo Nên Thương Hiệu
              </p>
              <h1 className="text-white/90 text-sm xl:text-lg mb-6 drop-shadow">
                Khám phá thế giới thủy sinh rực rỡ, nơi cung cấp hàng ngàn loại
                cá cảnh độc đáo, phụ kiện chất lượng và giải pháp toàn diện cho
                bể cá của bạn.
              </h1>
              <div className="flex justify-end">
                <Link
                  href="/san-pham"
                  title="Khám phá ngay các sản phẩm tại Kinh Đô Cá Cảnh"
                >
                  <motion.button
                    className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-sm xl:text-base font-medium py-2.5 px-6 rounded-full shadow-lg transition-all flex items-center gap-2 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Khám Phá Ngay</span>
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Giới thiệu */}
      <motion.div
        className="container mx-auto px-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-sky-800 mb-2 relative inline-block">
              Chào Mừng Đến Với Kinh Đô Cá Cảnh
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"></span>
            </h2>
          </motion.div>
          <motion.p className="text-base md:text-lg text-gray-600 max-w-4xl mx-auto mt-6 text-justify">
            Tọa lạc tại Thành phố Hồ Chí Minh,{" "}
            <strong className="text-sky-600">Kinh Đô Cá Cảnh</strong> tự hào là
            điểm đến tin cậy cho cộng đồng yêu thủy sinh. Chúng tôi chuyên cung
            cấp cá cảnh đa dạng chủng loại từ phổ thông đến độc lạ, bể cá thiết
            kế tinh xảo, phụ kiện cao cấp, cùng thức ăn và chế phẩm sinh học
            chuyên dụng, đảm bảo chất lượng vượt trội với mức giá cạnh tranh
            nhất.
          </motion.p>
        </div>

        {/* Các điểm nổi bật */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100/50 flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
              <Fish className="text-sky-600" size={30} />
            </div>
            <h3 className="text-xl font-semibold text-sky-800 mb-2">
              Cá Cảnh Đa Dạng Chủng Loại
            </h3>
            <p className="text-gray-600 text-sm">
              Khám phá bộ sưu tập cá cảnh phong phú: từ Betta, Neon, Guppy,
              Vàng, Rồng, Chuột quen thuộc đến những dòng cá độc đáo, hiếm có,
              đáp ứng mọi đam mê.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100/50 flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
              <Award className="text-sky-600" size={30} />
            </div>
            <h3 className="text-xl font-semibold text-sky-800 mb-2">
              Chất Lượng Vượt Trội - Giá Tốt
            </h3>
            <p className="text-gray-600 text-sm">
              Cam kết 100% sản phẩm cá cảnh khỏe mạnh, phụ kiện chính hãng. Chất
              lượng đi đôi với giá cả hợp lý, mang đến sự hài lòng tuyệt đối cho
              bạn.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100/50 flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
              <Droplets className="text-sky-600" size={30} />
            </div>
            <h3 className="text-xl font-semibold text-sky-800 mb-2">
              Tư Vấn Chuyên Nghiệp Từ Tâm
            </h3>
            <p className="text-gray-600 text-sm">
              Đội ngũ chuyên gia giàu kinh nghiệm sẵn sàng tư vấn mọi thắc mắc
              về kỹ thuật nuôi, chăm sóc cá và thiết kế hồ thủy sinh. Kho tàng
              kiến thức luôn được cập nhật.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-sky-100/50 flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="text-sky-600" size={30} />
            </div>
            <h3 className="text-xl font-semibold text-sky-800 mb-2">
              Trọn Bộ Phụ Kiện & Dịch Vụ
            </h3>
            <p className="text-gray-600 text-sm">
              Cung cấp đầy đủ từ A-Z: bể cá, máy lọc, đèn, thức ăn, thuốc, cây
              thủy sinh và dụng cụ chăm sóc, cùng dịch vụ setup bể cá tại nhà
              chuyên nghiệp.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Sản phẩm nổi bật */}
      <motion.div
        className="container mx-auto px-4 mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-sky-800 relative inline-block">
            Sản Phẩm Bán Chạy Nhất
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-sky-400 rounded-full w-3/4"></span>
          </h2>
          <Link
            href="/san-pham?sortBy=rating&sortOrder=desc"
            title="Xem tất cả sản phẩm bán chạy nhất tại Kinh Đô Cá Cảnh"
            className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium"
          >
            <span>Xem Thêm</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bài viết mới */}
      <motion.div
        className="container mx-auto px-4 mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-sky-800 relative inline-block">
            Góc Chia Sẻ Kiến Thức
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-sky-400 rounded-full w-3/4"></span>
          </h2>
          <Link
            href="/bai-viet"
            title="Xem tất cả bài viết kiến thức tại Kinh Đô Cá Cảnh"
            className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium"
          >
            <span>Đọc Thêm</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bài viết lớn bên trái */}
          {blogs[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="md:w-2/5"
            >
              <Link
                href={`/bai-viet/${blogs[0].slug}`}
                key={blogs[0]._id}
                title={`Đọc bài viết: ${blogs[0].title} - Kinh Đô Cá Cảnh`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={blogs[0].image}
                    alt={blogs[0].title}
                    fill
                    title={blogs[0].title}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    quality={80}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-sky-800 mb-3 line-clamp-2 group-hover:text-sky-600 transition-colors">
                    {blogs[0].title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blogs[0].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-sky-100 text-sky-600 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {blogs[0].author}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(blogs[0].publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
          {/* Các bài viết nhỏ bên phải */}
          <div className="flex-1 flex flex-col gap-4">
            {blogs.slice(1, 4).map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              >
                <Link
                  href={`/bai-viet/${blog.slug}`}
                  title={`Đọc bài viết: ${blog.title} - Kinh Đô Cá Cảnh`}
                  className="flex bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="relative w-36 h-28 flex-shrink-0 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      title={blog.title}
                      sizes="(max-width: 768px) 100px, 144px"
                      quality={75}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy02LjY2OjY2Njo2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njb/2wBDARUXFyAeIB4gHh4gIB4lICAgICUmJSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h4 className="font-semibold text-sky-800 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {blog.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{blog.author}</span>
                      <span>{formatDate(blog.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
