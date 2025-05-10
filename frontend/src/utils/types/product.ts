// Cấu trúc giá sản phẩm
export interface ProductPrice {
  origin_price: number;
  discount: number;
  sell_price: number;
}

// Cấu trúc ảnh sản phẩm
export interface ProductImage {
  url: string;
  alt: string;
}

// Cấu trúc meta thông tin SEO
export interface ProductMeta {
  title: string;
  metaDescription: string;
  keywords: string[];
  canonical: string;
  image: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

// Cấu trúc sản phẩm hiển thị trong danh sách
export interface ProductListItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  imageFirst: string;
  price: ProductPrice;
  avgRating: number;
  numReviews: number;
  updatedAt: string;
}

// Cấu trúc sản phẩm chi tiết
export interface ProductDetail {
  _id: string;
  pd_name: string;
  pd_slug: string;
  pd_category: string;
  pd_image: ProductImage[];
  pd_description: string;
  pd_price: ProductPrice;
  pd_stock: number;
  pd_avgRating: number;
  pd_numReviews: number;
  pd_meta?: ProductMeta;
  createdAt: string;
  updatedAt: string;
}

// Tham số lọc và phân trang sản phẩm
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'rating';
  sortOrder?: 'asc' | 'desc';
  slug?: string;
}

// Thông tin phân trang
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Response danh sách sản phẩm
export interface ProductListResponse {
  success: boolean;
  data: {
    products: ProductListItem[];
    pagination: PaginationInfo;
  };
}

// Response chi tiết sản phẩm
export interface ProductDetailResponse {
  success: boolean;
  data: ProductDetail;
}

// Response tìm kiếm sản phẩm
export interface ProductSearchResponse {
  success: boolean;
  data: ProductListItem[];
} 