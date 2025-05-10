"use client";

import { useState, useCallback } from 'react';
import { apis } from '../services/apis';
import { 
  ProductQueryParams, 
  ProductListItem, 
  ProductDetail, 
  PaginationInfo 
} from '../utils/types';

/**
 * Hook cung cấp các chức năng quản lý sản phẩm
 * @returns Các phương thức và trạng thái liên quan đến sản phẩm
 */
export const useProducts = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<ProductListItem[]>([]);

  /**
   * Lấy danh sách sản phẩm với các tùy chọn lọc và phân trang
   * @param params Các tham số lọc và phân trang
   */
  const getProducts = useCallback(async (params?: ProductQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apis.getProducts(params);
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải danh sách sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Tìm kiếm sản phẩm theo từ khóa
   * @param keyword Từ khóa tìm kiếm
   */
  const searchProducts = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await apis.searchProducts(keyword);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tìm kiếm sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lấy chi tiết sản phẩm theo ID
   * @param productId ID của sản phẩm
   */
  const getProductDetail = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apis.getProductDetail(productId);
      if (response.success) {
        setProductDetail(response.data);
        return response.data;
      }
      return null;
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thông tin sản phẩm');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lấy chi tiết sản phẩm bằng slug
   * @param slug Slug của sản phẩm
   */
  const getProductBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Đang tìm sản phẩm với slug: ${slug}`);
      // Tìm kiếm sản phẩm trực tiếp từ API bằng slug
      const response = await apis.getProducts({ slug });
      console.log(`Kết quả tìm kiếm:`, response.data.products);
      
      if (response.success && response.data.products.length > 0) {
        // Tìm chính xác sản phẩm có slug khớp hoàn toàn
        const exactProduct = response.data.products.find(p => p.slug === slug);
        
        if (exactProduct) {
          console.log(`Đã tìm thấy sản phẩm chính xác: ${exactProduct.name} (ID: ${exactProduct._id})`);
          const result = await getProductDetail(exactProduct._id);
          setProductDetail(result);
          return result;
        } else if (response.data.products.length > 0) {
          // Fallback: Lấy sản phẩm đầu tiên nếu không tìm thấy kết quả chính xác
          console.log(`Không tìm thấy sản phẩm chính xác, sử dụng sản phẩm đầu tiên: ${response.data.products[0].name}`);
          const result = await getProductDetail(response.data.products[0]._id);
          setProductDetail(result);
          return result;
        }
      }
      
      console.log(`Không tìm thấy sản phẩm với slug: ${slug}`);
      setError('Không tìm thấy thông tin sản phẩm');
      return null;
    } catch (err) {
      console.error(`Lỗi khi tìm sản phẩm với slug ${slug}:`, err);
      setError('Có lỗi xảy ra khi tìm kiếm sản phẩm');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getProductDetail]);

  /**
   * Xóa lỗi hiện tại
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Trạng thái
    products,
    productDetail,
    pagination,
    loading,
    error,
    searchResults,
    
    // Phương thức
    getProducts,
    searchProducts,
    getProductDetail,
    getProductBySlug,
    clearError
  };
}; 