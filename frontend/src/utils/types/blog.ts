import { ApiResponse } from './api-response';

// Interfaces cho Blog Content Blocks
export interface BaseBlock {
    type: 'heading' | 'paragraph' | 'image' | 'video';
    content: string;
}

export interface HeadingBlock extends BaseBlock {
    type: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphBlock extends BaseBlock {
    type: 'paragraph';
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    url: string;
    alt: string;
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    url: string;
}

export type BlockContent = HeadingBlock | ParagraphBlock | ImageBlock | VideoBlock;

// Interface cho SEO
export interface SEO {
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

// Interface cho Blog trong danh sách
export interface BlogSummary {
    _id: string;
    title: string;
    slug: string;
    tags: string[];
    author: string;
    publishedAt: string;
    updatedAt: string;
    image: string;
}

// Interface cho Blog chi tiết
export interface BlogDetail {
    _id: string;
    title: string;
    slug: string;
    tags: string[];
    content: string;
    author: string;
    meta: SEO;
    publishedAt: string;
    updatedAt: string;
    blog_image: string;
}

// Interface cho Query parameters khi lấy danh sách blog
export interface BlogQueryParams {
    page?: number;
    limit?: number;
    tags?: string | string[];
    sortBy?: 'publishedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}

export interface BlogListResponse extends ApiResponse<{
    blogs: BlogSummary[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}> {
  // Để tránh lỗi empty-object-type, thêm một thuộc tính mô tả
  _type?: 'BlogListResponse';
}

export interface BlogDetailResponse extends ApiResponse<BlogDetail> {
  _type?: 'BlogDetailResponse';
} 