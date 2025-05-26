import { useState, useCallback } from 'react';
import { apis } from '@/services/apis';
import { BlogSummary, BlogDetail, BlogQueryParams } from '@/utils/types';

/**
 * @hook useBlogs
 * @description Custom hook quản lý việc lấy dữ liệu blog từ API
 */
export const useBlogs = () => {
    // State lưu trữ danh sách blog
    const [blogs, setBlogs] = useState<BlogSummary[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // State lưu trữ thông tin chi tiết blog
    const [blogDetail, setBlogDetail] = useState<BlogDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    // Thêm các state mới
    const [queryParams, setQueryParams] = useState<BlogQueryParams>({
        page: 1,
        limit: 10,
        sortBy: 'publishedAt',
        sortOrder: 'desc'
    });
    
    // Tạo đối tượng pagination
    const pagination = {
        total,
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        totalPages: Math.ceil(total / (queryParams.limit || 10))
    };
    
    // 1. Khai báo fetchBlogs trước
    const fetchBlogs = useCallback(async (params?: BlogQueryParams) => {
        try {
            setLoading(true);
            const updatedParams = params || queryParams;
            if (params && JSON.stringify(params) !== JSON.stringify(queryParams)) {
                setQueryParams(updatedParams);
            }
            const response = await apis.getBlogs(updatedParams);

            if (response.success) {
                setBlogs(response.data?.blogs || []);
                setTotal(response.data?.pagination.total || 0);
            } else {
                setError(response.message || 'Có lỗi xảy ra khi lấy danh sách bài viết');
            }
        } catch (err: unknown) {
            let message = 'Có lỗi xảy ra khi lấy danh sách bài viết';
            if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string') {
                message = (err as { message?: string }).message!;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [queryParams]);

    // 2. Sau đó mới khai báo goToPage và changeLimit
    const goToPage = useCallback((page: number) => {
        fetchBlogs({ ...queryParams, page });
    }, [queryParams, fetchBlogs]);
    
    const changeLimit = useCallback((limit: number) => {
        fetchBlogs({ ...queryParams, limit, page: 1 });
    }, [queryParams, fetchBlogs]);

    /**
     * Lấy chi tiết bài viết theo slug
     */
    const fetchBlogBySlug = useCallback(async (slug: string) => {
        try {
            setDetailLoading(true);
            setDetailError(null);

            const response = await apis.getBlogBySlug(slug);

            if (response.success) {
                setBlogDetail(response.data ?? null);
            } else {
                setDetailError(response.message || 'Có lỗi xảy ra khi lấy chi tiết bài viết');
            }
        } catch (err: unknown) {
            let message = 'Có lỗi xảy ra khi lấy chi tiết bài viết';
            if (typeof err === 'object' && err && 'message' in err && typeof (err as { message?: string }).message === 'string') {
                message = (err as { message?: string }).message!;
            }
            setDetailError(message);
        } finally {
            setDetailLoading(false);
        }
    }, []);

    return {
        blogs,
        total,
        loading,
        error,
        blogDetail,
        detailLoading,
        detailError,
        pagination,
        queryParams,
        fetchBlogs,
        fetchBlogBySlug,
        goToPage,
        changeLimit
    };
}; 