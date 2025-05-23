"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import ReviewItem from "@/components/ui/ReviewItem";
import ReviewDialog from "@/components/ui/ReviewDialog";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { formatCurrency } from "@/utils/helpers";
import { Review } from "@/utils/types/review";
import { PRODUCT_CATEGORIES } from "@/app/(shop)/san-pham/products-client";
import { useCart } from "@/contexts/CartContext";
import { Loader2, AlertCircle, CheckCircle, Minus, Plus } from "lucide-react";

export default function ProductDetailClient() {
  const params = useParams();
  const router = useRouter();

  const {
    productDetail,
    loading,
    error,
    relatedProducts,
    getProductBySlug,
    getRelatedProducts,
  } = useProducts();

  const {
    reviews,
    pagination,
    loading: reviewsLoading,
    error: reviewsError,
    success,
    getProductReviews,
    createReview,
    updateReview,
    deleteReview,
    clearMessages,
  } = useReviews();

  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const { addToCart, isProductInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const [activeImage, setActiveImage] = useState<string>("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [currentTab, setCurrentTab] = useState<"description" | "reviews">(
    "description"
  );

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    if (params.slug) {
      getProductBySlug(params.slug as string);
    }
  }, [params.slug, getProductBySlug]);

  // Lấy đánh giá của sản phẩm
  useEffect(() => {
    if (productDetail?._id) {
      getProductReviews(productDetail._id);
    }
  }, [productDetail?._id, getProductReviews]);

  // Cập nhật ảnh hiển thị
  useEffect(() => {
    if (productDetail?.pd_image && productDetail.pd_image.length > 0) {
      setActiveImage(productDetail.pd_image[0].url);
    }
  }, [productDetail]);

  // Lấy sản phẩm liên quan
  useEffect(() => {
    if (productDetail?._id && productDetail?.pd_category) {
      getRelatedProducts(productDetail.pd_category, productDetail._id);
    }
  }, [productDetail?._id, productDetail?.pd_category, getRelatedProducts]);

  // Kiểm tra xem người dùng có thể chỉnh sửa đánh giá hay không
  const canModifyReview = (review: Review) => {
    if (!isAuthenticated || !user) return false;

    try {
      // Nếu user_id là chuỗi, kiểm tra xem có trùng với email người dùng hiện tại
      if (typeof review.user_id === "string") {
        // Kiểm tra email người dùng
        if (user.email === review.user_id) return true;

        // Kiểm tra các thuộc tính của user có giá trị trùng với user_id
        return Object.values(user).some(
          (value) => typeof value === "string" && value === review.user_id
        );
      }

      // Nếu user_id là đối tượng ReviewUser, kiểm tra thông tin
      if (
        review.user_id &&
        typeof review.user_id === "object" &&
        review.user_id.info_user &&
        review.user_id.info_user.username
      ) {
        // So sánh tên người dùng nếu có
        const { lastname, firstname } = review.user_id.info_user.username;
        if (
          user.info_user &&
          user.info_user.username &&
          user.info_user.username.lastname === lastname &&
          user.info_user.username.firstname === firstname
        ) {
          return true;
        }
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra quyền chỉnh sửa đánh giá:", error);
    }

    return false; // Mặc định không cho phép chỉnh sửa nếu không xác định được
  };

  // Kiểm tra nếu người dùng đã đánh giá sản phẩm này
  const hasUserReviewed = () => {
    if (!isAuthenticated || !user || !reviews || reviews.length === 0) {
      return false;
    }

    return reviews.some((review) => canModifyReview(review));
  };

  // Lấy đánh giá của người dùng hiện tại (nếu có)
  const getUserReview = () => {
    if (!isAuthenticated || !user) return null;
    return reviews.find((review) => canModifyReview(review)) || null;
  };

  const userHasReviewed = hasUserReviewed();

  // Mở dialog tạo đánh giá mới
  const handleOpenReviewDialog = () => {
    if (!isAuthenticated) {
      showToast("error", "Bạn cần đăng nhập để đánh giá sản phẩm");
      return;
    }

    // Kiểm tra xem người dùng đã đánh giá chưa
    if (userHasReviewed) {
      const review = getUserReview();
      if (review) {
        // Mở form chỉnh sửa thay vì tạo mới
        handleEditReview(review);
        return;
      }
      showToast(
        "warning",
        "Bạn đã đánh giá sản phẩm này. Bạn có thể chỉnh sửa đánh giá của mình."
      );
      return;
    }

    setReviewToEdit(null);
    clearMessages();
    setIsReviewDialogOpen(true);
  };

  // Mở dialog chỉnh sửa đánh giá
  const handleEditReview = (review: Review) => {
    setReviewToEdit(review);
    clearMessages();
    setIsReviewDialogOpen(true);
  };

  // Xóa đánh giá
  const handleDeleteReview = async (reviewId: string) => {
    const result = await deleteReview(reviewId);
    if (result && productDetail?._id) {
      // Tải lại danh sách đánh giá để cập nhật đầy đủ thông tin
      await getProductReviews(productDetail._id);
      showToast("success", "Đánh giá đã được xóa thành công");
    }
  };

  // Kiểm tra sản phẩm đang tải
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Kiểm tra lỗi
  if (error || !productDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <p className="mb-6">
            {error || "Sản phẩm không tồn tại hoặc đã bị xóa."}
          </p>
          <Link
            href="/san-pham"
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
          >
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const {
    pd_name,
    pd_category,
    pd_image,
    pd_description,
    pd_price,
    pd_stock,
    pd_avgRating,
    pd_numReviews,
  } = productDetail;

  // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  const productInCart = isProductInCart(productDetail._id);

  // Hàm xử lý thêm vào giỏ
  const handleAddToCart = async () => {
    setIsAdding(true);
    setAddError(null);
    setAddSuccess(false);

    try {
      const success = await addToCart(productDetail._id, quantity);
      if (success) {
        setAddSuccess(true);
        // Tự động ẩn thông báo thành công sau 3 giây
        setTimeout(() => setAddSuccess(false), 3000);
      } else {
        setAddError("Không thể thêm vào giỏ hàng");
      }
    } catch (err) {
      setAddError("Lỗi khi thêm vào giỏ hàng");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Xử lý mua ngay
  const handleBuyNow = async () => {
    if (productInCart) {
      // Nếu sản phẩm đã có trong giỏ hàng, chuyển đến trang giỏ hàng
      router.push("/gio-hang");
      return;
    }

    setIsAdding(true);
    setAddError(null);

    try {
      const success = await addToCart(productDetail._id, quantity);
      if (success) {
        // Chuyển hướng đến trang thanh toán sau khi thêm vào giỏ hàng
        router.push("/thanh-toan");
      } else {
        setAddError("Không thể thêm vào giỏ hàng");
        showToast("error", "Không thể thêm sản phẩm vào giỏ hàng");
      }
    } catch (err) {
      setAddError("Lỗi khi thêm vào giỏ hàng");
      showToast("error", "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { slug: "/san-pham", label: "Sản phẩm" },
              { slug: `/san-pham/${params.slug}`, label: pd_name },
            ]}
          />
        </div>

        {/* Layout chính - chia thành 2 cột */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột trái - Nội dung chính */}
          <div className="lg:w-3/4">
            {/* Chi tiết sản phẩm */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gallery ảnh */}
                <div>
                  <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-80 relative">
                    {activeImage && (
                      <Image
                        src={activeImage}
                        alt={pd_name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {pd_image &&
                      pd_image.map((image, idx) => (
                        <div
                          key={idx}
                          className={`h-16 rounded-md overflow-hidden relative cursor-pointer transition-all ${
                            activeImage === image.url
                              ? "border-2 border-primary-500"
                              : "border border-gray-200 opacity-80 hover:opacity-100"
                          }`}
                          onClick={() => setActiveImage(image.url)}
                        >
                          <Image
                            src={image.url}
                            alt={pd_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    {pd_name}
                  </h1>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(pd_avgRating)
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
                      <span className="text-sm text-gray-600">
                        {pd_avgRating.toFixed(1)} ({pd_numReviews} đánh giá)
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentTab("reviews")}
                      className="ml-4 text-sm text-sky-600 hover:text-sky-700"
                    >
                      Xem đánh giá
                    </button>
                  </div>
                  <div className="mb-3">
                    <span className="font-medium text-gray-500">
                      Danh mục:{" "}
                      {PRODUCT_CATEGORIES.find(
                        (cat) => cat.slug === pd_category
                      )?.title || pd_category}
                    </span>
                  </div>
                  <div className="mb-6">
                    <div className="text-2xl font-bold text-rose-600 mb-1">
                      {pd_price?.discount > 0 ? (
                        <div className="flex items-center mb-4">
                          <span>{formatCurrency(pd_price.sell_price)}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatCurrency(pd_price.origin_price)}
                          </span>
                          <span className="ml-2 bg-red-100 text-rose-600 text-xs font-semibold px-2 py-1 rounded">
                            -
                            {Math.round(
                              (1 -
                                pd_price.sell_price / pd_price.origin_price) *
                                100
                            )}
                            %
                          </span>
                        </div>
                      ) : (
                        formatCurrency(pd_price?.sell_price)
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {pd_stock > 0 ? (
                        <span className="text-green-600">Còn hàng</span>
                      ) : (
                        <span className="text-red-600">Hết hàng</span>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Mô tả ngắn:
                    </p>
                    <p className="text-gray-600">
                      {pd_description?.substring(0, 100)}
                      {pd_description?.length > 100 ? "..." : ""}
                    </p>
                  </div>

                  <div className="mb-4 flex items-center gap-6">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số lượng:
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={quantity <= 1}
                        className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 py-1 border-y border-gray-300 text-center focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) =>
                            Math.min(prev + 1, pd_stock || 99)
                          )
                        }
                        disabled={pd_stock ? quantity >= pd_stock : false}
                        className="px-3 py-2 border border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                      </button>
                      {pd_stock > 0 && (
                        <span className="ml-3 text-sm text-gray-500">
                          Còn {pd_stock} sản phẩm
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleAddToCart}
                        disabled={isAdding || productInCart}
                        className={`py-3 px-8 rounded-md text-base font-medium transition-colors flex items-center justify-center ${
                          productInCart
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-600"
                            : "bg-white hover:bg-amber-50 text-amber-600 border border-amber-600"
                        }`}
                      >
                        {isAdding ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                            Đang thêm...
                          </>
                        ) : productInCart ? (
                          <>Đã có trong giỏ</>
                        ) : (
                          "Thêm vào giỏ"
                        )}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={isAdding}
                        className="py-3 px-8 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-base font-medium transition-colors text-center"
                      >
                        {productInCart ? "Xem giỏ hàng" : "Mua ngay"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setCurrentTab("description")}
                    className={`py-3 font-medium text-sm ${
                      currentTab === "description"
                        ? "text-primary-600 border-b-2 border-primary-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Mô tả sản phẩm
                  </button>
                  <button
                    onClick={() => setCurrentTab("reviews")}
                    className={`py-3 font-medium text-sm ${
                      currentTab === "reviews"
                        ? "text-primary-600 border-b-2 border-primary-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Đánh giá ({pd_numReviews})
                  </button>
                </div>
              </div>

              <div>
                {currentTab === "description" && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Mô tả sản phẩm
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: pd_description }}
                      className="prose max-w-none"
                    />
                  </>
                )}

                {currentTab === "reviews" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Đánh giá từ khách hàng ({pd_numReviews})
                      </h2>
                      {isAuthenticated && (
                        <button
                          onClick={handleOpenReviewDialog}
                          className={`px-4 py-2 rounded-md text-sm font-medium ${
                            userHasReviewed
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-yellow-500 text-white hover:bg-yellow-600"
                          }`}
                        >
                          {userHasReviewed
                            ? "Chỉnh sửa đánh giá"
                            : "Viết đánh giá"}
                        </button>
                      )}
                    </div>

                    {/* Hiển thị lỗi nếu có khi tải reviews */}
                    {reviewsError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm">
                        <p>Lỗi khi tải đánh giá: {reviewsError}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {reviewsLoading ? (
                        <div className="flex justify-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-600 mb-4">
                            Chưa có đánh giá nào cho sản phẩm này.
                          </p>
                          {isAuthenticated ? (
                            <button
                              onClick={handleOpenReviewDialog}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md text-sm"
                            >
                              Hãy là người đầu tiên đánh giá
                            </button>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Đăng nhập để đánh giá sản phẩm này
                            </p>
                          )}
                        </div>
                      ) : (
                        reviews.map((review) => (
                          <ReviewItem
                            key={review._id}
                            review={review}
                            canModify={canModifyReview(review)}
                            onEdit={handleEditReview}
                            onDelete={handleDeleteReview}
                          />
                        ))
                      )}
                    </div>

                    {/* Phân trang cho đánh giá */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex space-x-1">
                          {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                getProductReviews(productDetail._id, {
                                  page: i + 1,
                                  limit: pagination.limit,
                                })
                              }
                              className={`px-3 py-1 rounded-md text-sm ${
                                pagination.page === i + 1
                                  ? "bg-primary-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải - Sản phẩm liên quan */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Sản phẩm liên quan
                </h2>
                <div className="space-y-4">
                  {relatedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
                    >
                      <Link
                        href={`/san-pham/${product.slug}`}
                        className="block hover:opacity-90"
                      >
                        <div className="relative h-40">
                          <Image
                            src={product.imageFirst}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.price.discount > 0 && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              -
                              {Math.round(
                                (1 -
                                  product.price.sell_price /
                                    product.price.origin_price) *
                                  100
                              )}
                              %
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
                            {product.name}
                          </p>
                          <div className="flex items-center mt-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.avgRating)
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
                              ({product.numReviews})
                            </span>
                          </div>
                          <div className="text-sm font-bold text-primary-600">
                            {product.price.discount > 0 ? (
                              <div className="flex items-center">
                                <span>
                                  {formatCurrency(product.price.sell_price)}
                                </span>
                                <span className="text-xs text-gray-500 line-through ml-1">
                                  {formatCurrency(product.price.origin_price)}
                                </span>
                              </div>
                            ) : (
                              formatCurrency(product.price.sell_price)
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog đánh giá */}
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        productId={productDetail._id}
        onClose={() => {
          setIsReviewDialogOpen(false);
          // Nếu có lỗi "đã đánh giá", tự động cập nhật UI
          if (error && error.includes("đã đánh giá")) {
            getProductReviews(productDetail._id);
          }
        }}
        onCreateReview={async (data) => {
          try {
            const result = await createReview(data);
            if (result) {
              // Tải lại danh sách đánh giá để cập nhật đầy đủ thông tin
              await getProductReviews(productDetail._id);
              showToast("success", "Đánh giá của bạn đã được gửi thành công!");
            }
            return result;
          } catch (error: unknown) {
            // Type guard để kiểm tra error có phải là đối tượng có thuộc tính message
            if (
              error instanceof Error &&
              error.message &&
              error.message.includes("đã đánh giá")
            ) {
              showToast("error", "Bạn đã đánh giá sản phẩm này rồi");
            } else if (error instanceof Error) {
              // Xử lý các lỗi Error khác nếu cần, hoặc hiển thị message chung
              showToast(
                "error",
                error.message || "Có lỗi xảy ra khi gửi đánh giá."
              );
            } else {
              // Xử lý các trường hợp lỗi không xác định
              showToast("error", "Có lỗi không xác định xảy ra.");
            }
            return false;
          }
        }}
        onUpdateReview={async (id, data) => {
          const result = await updateReview(id, data);
          if (result) {
            // Tải lại danh sách đánh giá để cập nhật đầy đủ thông tin
            await getProductReviews(productDetail._id);
            showToast("success", "Đánh giá của bạn đã được cập nhật!");
          }
          return result;
        }}
        isSubmitting={loading}
        error={error}
        success={success}
        reviewToEdit={reviewToEdit}
      />

      {/* Thông báo lỗi/thành công */}
      {addError && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" /> {addError}
        </div>
      )}
      {addSuccess && (
        <div className="mt-2 text-green-500 text-sm flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" /> Sản phẩm đã được thêm vào giỏ
          hàng!
        </div>
      )}
    </>
  );
}
