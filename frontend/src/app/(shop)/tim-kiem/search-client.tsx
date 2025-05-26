"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/utils/helpers";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/button";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const { searchResults, loading, error, searchProducts } = useProducts();
  const [emptySearch, setEmptySearch] = useState(false);

  useEffect(() => {
    if (keyword) {
      searchProducts(keyword);
      setEmptySearch(false);
    } else {
      setEmptySearch(true);
    }
  }, [keyword, searchProducts]);

  // Hiệu ứng cho sản phẩm
  const productVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  if (emptySearch) {
    return (
      <div className="container mx-auto px-4 pb-8">
        <Breadcrumbs items={[{ slug: "/tim-kiem", label: "Tìm kiếm" }]} />

        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-20 h-20 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-6"
          >
            <Search size={32} />
          </motion.div>

          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Tìm kiếm sản phẩm
          </motion.h1>

          <motion.p
            className="text-gray-600 max-w-lg mx-auto mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Vui lòng nhập từ khóa tìm kiếm trong thanh tìm kiếm ở trên để tìm
            sản phẩm bạn cần.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/san-pham" title="Xem tất cả sản phẩm">
              <Button className="bg-sky-600 hover:bg-sky-700">
                Xem tất cả sản phẩm
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto pb-8 px-4">
        <Breadcrumbs
          items={[
            { slug: "/tim-kiem", label: "Tìm kiếm" },
            {
              slug: `/tim-kiem?q=${encodeURIComponent(keyword)}`,
              label: keyword,
            },
          ]}
        />

        <div className="text-center py-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-4" />
            <p className="text-gray-600">Đang tìm kiếm sản phẩm...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 pb-8">
        <Breadcrumbs
          items={[
            { slug: "/tim-kiem", label: "Tìm kiếm" },
            {
              slug: `/tim-kiem?q=${encodeURIComponent(keyword)}`,
              label: keyword,
            },
          ]}
        />

        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
              <p className="text-lg font-semibold mb-2">Lỗi khi tìm kiếm</p>
              <p className="mb-4">{error}</p>
              <Button
                onClick={() => searchProducts(keyword)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Thử lại
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-8">
      <Breadcrumbs
        items={[
          { slug: "/tim-kiem", label: "Tìm kiếm" },
          {
            slug: `/tim-kiem?q=${encodeURIComponent(keyword)}`,
            label: keyword,
          },
        ]}
      />

      <div className="mb-8 mt-4">
        <motion.h1
          className="text-2xl md:text-3xl font-bold text-sky-600 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Kết quả tìm kiếm cho &quot;{keyword}&quot;
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Tìm thấy {searchResults.length} sản phẩm
        </motion.p>
      </div>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product, index) => (
            <motion.div
              key={product._id}
              custom={index}
              variants={productVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <Link href={`/san-pham/${product.slug}`} title={product.name}>
                <div className="relative h-48 bg-gray-100">
                  {product.imageFirst && (
                    <Image
                      src={product.imageFirst}
                      alt={product.name}
                      fill
                      sizes="(max-width: 356px) 100vw"
                      priority
                      className="object-cover"
                      title={product.name}
                    />
                  )}
                  {product.price?.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.price.discount}%
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium text-sm md:text-base mb-2 line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.avgRating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.numReviews || 0})
                    </span>
                  </div>
                  <div className="mt-2">
                    {product.price?.discount > 0 ? (
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-sky-600 mr-2">
                          {formatCurrency(product.price.sell_price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.price.origin_price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-sky-600">
                        {product.price
                          ? formatCurrency(product.price.sell_price)
                          : "Liên hệ"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="text-center py-16 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Search size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Không tìm thấy sản phẩm nào
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Không tìm thấy sản phẩm nào phù hợp với từ khóa &quot;{keyword}
            &quot;. Vui lòng thử lại với từ khóa khác.
          </p>
          <Link href="/san-pham">
            <Button className="bg-sky-600 hover:bg-sky-700">
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
