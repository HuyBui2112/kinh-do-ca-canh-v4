"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';
import { useMetadata } from '@/contexts/MetadataContext';
import ReviewItem from '@/components/ui/ReviewItem';
import ReviewDialog from '@/components/ui/ReviewDialog';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ProductDetail } from '@/utils/types';
import { Review } from '@/utils/types/review';

export default function ProductDetailClient() {
  const params = useParams();
  const { productDetail, loading, error, getProductBySlug } = useProducts();
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
    clearMessages
  } = useReviews();
  const { user, isAuthenticated } = useAuth();
  const { updateMetadata } = useMetadata();
  
  const [activeImage, setActiveImage] = useState<string>('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState<boolean>(false);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
  const [currentTab, setCurrentTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Lấy dữ liệu sản phẩm
  useEffect(() => {
    if (params.slug) {
      getProductBySlug(params.slug as string);
    }
  }, [params.slug, getProductBySlug]);

  // Tạo metadata dựa trên dữ liệu sản phẩm
  const metadata = useMemo(() => {
    if (!productDetail) return null;
    
    return {
      title: `${productDetail.pd_name} | Kinh Đô Cá Cảnh`,
      description: productDetail.pd_description?.substring(0, 160).replace(/<[^>]*>/g, '') || 
        "Xem chi tiết sản phẩm tại Kinh Đô Cá Cảnh - cửa hàng cá cảnh uy tín hàng đầu Việt Nam.",
      keywords: `${productDetail.pd_name}, ${productDetail.pd_category}, cá cảnh, thủy sinh`
    };
  }, [productDetail]);

  // Cập nhật metadata khi có dữ liệu sản phẩm
  useEffect(() => {
    if (metadata) {
      updateMetadata(metadata);
    }
  }, [metadata, updateMetadata]);

  // Lấy đánh giá của sản phẩm
  useEffect(() => {
    // Sử dụng ref để theo dõi xem đã tải đánh giá chưa
    const reviewsRef = { current: false };
    
    if (productDetail?._id && !reviewsRef.current) {
      reviewsRef.current = true;
      getProductReviews(productDetail._id);
    }
    
    return () => {
      reviewsRef.current = false;
    };
  }, [productDetail?._id, getProductReviews]);

  // Cập nhật ảnh hiển thị
  useEffect(() => {
    if (productDetail?.pd_image && productDetail.pd_image.length > 0) {
      setActiveImage(productDetail.pd_image[0].url);
    }
  }, [productDetail]);

  // Mở dialog tạo đánh giá mới
  const handleOpenReviewDialog = () => {
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
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?');
    if (confirmed) {
      await deleteReview(reviewId);
    }
  };

  // Kiểm tra xem người dùng có thể chỉnh sửa đánh giá hay không
  const canModifyReview = (review: Review) => {
    if (!isAuthenticated || !user) return false;
    
    // Nếu user_id là chuỗi, so sánh trực tiếp với các thuộc tính phổ biến của user
    if (typeof review.user_id === 'string') {
      // Kiểm tra tất cả các thuộc tính phổ biến có thể là ID
      return Object.values(user).some(value => 
        typeof value === 'string' && value === review.user_id
      );
    }
    
    // Nếu là đối tượng, kiểm tra thông tin
    return false; // Cần bổ sung logic kiểm tra dựa trên cấu trúc dữ liệu thực tế
  };

  // Kiểm tra sản phẩm đang tải
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Kiểm tra lỗi
  if (error || !productDetail) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <p className="mb-6">{error || 'Sản phẩm không tồn tại hoặc đã bị xóa.'}</p>
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
    pd_numReviews
  } = productDetail;

  return (
    <>      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm">
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <Link href="/san-pham" className="text-gray-500 hover:text-gray-900 text-sm">
                  Sản phẩm
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-primary-600 text-sm">{pd_name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Ảnh sản phẩm */}
          <div className="flex flex-col">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
              <Image
                src={activeImage || '/images/product-placeholder.jpg'}
                alt={pd_name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {pd_image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                    activeImage === img.url ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || pd_name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{pd_name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(pd_avgRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">{pd_avgRating.toFixed(1)} ({pd_numReviews} đánh giá)</span>
              <button
                onClick={() => setCurrentTab('reviews')}
                className="text-primary-600 text-sm ml-4 hover:underline"
              >
                Xem đánh giá
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="mr-4">
                <span className="block text-sm text-gray-500">Danh mục:</span>
                <Link 
                  href={`/san-pham?category=${pd_category}`}
                  className="text-primary-600 hover:underline"
                >
                  {pd_category}
                </Link>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Tình trạng:</span>
                <span className={pd_stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {pd_stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>

            <div className="mb-6">
              {pd_price.discount > 0 ? (
                <>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-primary-600 mr-3">
                      {formatCurrency(pd_price.sell_price)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatCurrency(pd_price.origin_price)}
                    </span>
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{Math.round(pd_price.discount)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tiết kiệm: {formatCurrency(pd_price.origin_price - pd_price.sell_price)}
                  </p>
                </>
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(pd_price.sell_price)}
                </span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <button
                  className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-md flex-grow text-center transition-colors"
                  disabled={pd_stock <= 0}
                >
                  Thêm vào giỏ hàng
                </button>
                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 p-3 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
              
              {pd_stock <= 0 && (
                <p className="text-red-600 text-sm">
                  Sản phẩm hiện đang hết hàng. Vui lòng quay lại sau.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setCurrentTab('description')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'description'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mô tả sản phẩm
              </button>
              <button
                onClick={() => setCurrentTab('specifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'specifications'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thông số kỹ thuật
              </button>
              <button
                onClick={() => setCurrentTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentTab === 'reviews'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Đánh giá ({pd_numReviews})
              </button>
            </nav>
          </div>

          <div className="py-6">
            {currentTab === 'description' && (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: pd_description }} />
            )}

            {currentTab === 'specifications' && (
              <div className="border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-800 mb-2">Loại sản phẩm</h3>
                    <p>{pd_category}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-semibold text-gray-800 mb-2">Số lượng trong kho</h3>
                    <p>{pd_stock}</p>
                  </div>
                  {/* Có thể thêm các thông số khác nếu có */}
                </div>
              </div>
            )}

            {currentTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Đánh giá của khách hàng ({pd_numReviews})
                  </h3>
                  <button
                    onClick={handleOpenReviewDialog}
                    className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm"
                  >
                    Viết đánh giá
                  </button>
                </div>

                {reviewsError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
                    {reviewsError}
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                    <button
                      onClick={handleOpenReviewDialog}
                      className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm"
                    >
                      Hãy là người đầu tiên đánh giá
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <ReviewItem
                        key={review._id}
                        review={review}
                        canModify={canModifyReview(review)}
                        onEdit={handleEditReview}
                        onDelete={handleDeleteReview}
                      />
                    ))}

                    {pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <nav className="flex items-center">
                          <button
                            onClick={() => getProductReviews(productDetail._id, { page: pagination.page - 1 })}
                            disabled={pagination.page === 1}
                            className="px-3 py-2 rounded-md mr-2 border text-gray-600 disabled:opacity-50"
                          >
                            &lt; Trước
                          </button>
                          
                          {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => getProductReviews(productDetail._id, { page: i + 1 })}
                              className={`w-10 h-10 mx-1 rounded-md ${
                                pagination.page === i + 1
                                  ? 'bg-primary-600 text-white'
                                  : 'border text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => getProductReviews(productDetail._id, { page: pagination.page + 1 })}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-3 py-2 rounded-md ml-2 border text-gray-600 disabled:opacity-50"
                          >
                            Sau &gt;
                          </button>
                        </nav>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog đánh giá */}
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        productId={productDetail._id}
        onClose={() => setIsReviewDialogOpen(false)}
        onCreateReview={createReview}
        onUpdateReview={updateReview}
        isSubmitting={loading}
        error={error}
        success={success}
        reviewToEdit={reviewToEdit}
      />
    </>
  );
} 