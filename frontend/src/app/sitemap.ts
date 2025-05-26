import { MetadataRoute } from 'next';
import { apis } from '@/services/apis';

// Địa chỉ website của bạn
// const BASE_URL = 'https://kinhdocacanh.shop';
const BASE_URL = 'http://localhost:3000';

// Giả định kiểu dữ liệu trả về từ API của bạn có các trường này
interface ProductLight {
  slug: string;
  updatedAt?: string; // updatedAt có thể không có, nên để optional
  // Nếu không có updatedAt, bạn có thể dùng một ngày mặc định hoặc ngày hiện tại
}

interface BlogLight {
  slug: string;
  publishedAt?: string; // publishedAt có thể không có, nên để optional
  // Nếu không có publishedAt, bạn có thể dùng một ngày mặc định hoặc ngày hiện tại
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/san-pham`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bai-viet`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ve-chung-toi`, // Trang "Về chúng tôi"
      lastModified: currentDate, 
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tim-kiem`,
      lastModified: currentDate,
      changeFrequency: 'weekly', // Hoặc daily nếu nội dung kết quả tìm kiếm tiềm năng thay đổi thường xuyên
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/gio-hang`,
      lastModified: currentDate,
      changeFrequency: 'monthly', // Nội dung giỏ hàng thay đổi theo người dùng, nhưng cấu trúc trang thì không
      priority: 0.5,      // Các trang như giỏ hàng, thanh toán, tài khoản thường không muốn index mạnh
    },
    {
      url: `${BASE_URL}/thanh-toan`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/dang-nhap`,
      lastModified: currentDate,
      changeFrequency: 'yearly', // Trang này ít thay đổi
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/dang-ky`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/ca-nhan`,
      lastModified: currentDate, // Nội dung thay đổi theo người dùng, cấu trúc trang ít đổi
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Ví dụ thêm trang liên hệ nếu có
    // {
    //   url: `${BASE_URL}/lien-he`,
    //   lastModified: currentDate,
    //   changeFrequency: 'yearly',
    //   priority: 0.6,
    // },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    // Lấy tất cả sản phẩm (hoặc một lượng lớn đủ để bao phủ sitemap)
    // Giả định API trả về `slug` và `updatedAt` cho mỗi sản phẩm
    const productsResponse = await apis.getProducts({ limit: 1000, page: 1 }); 
    if (productsResponse && productsResponse.success && Array.isArray(productsResponse.data?.products)) {
      const products: ProductLight[] = productsResponse.data.products.map(p => ({
        slug: p.slug,
        updatedAt: p.updatedAt || currentDate // Sử dụng currentDate nếu updatedAt không có
      }));
      productRoutes = products.map((product) => ({
        url: `${BASE_URL}/san-pham/${product.slug}`,
        lastModified: new Date(product.updatedAt!).toISOString(), // Thêm ! vì đã có fallback
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else {
      console.error("Sitemap: Không thể lấy dữ liệu sản phẩm hoặc dữ liệu không hợp lệ.");
    }
  } catch (error) {
    console.error("Sitemap: Lỗi khi fetch sản phẩm:", error);
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    // Lấy tất cả bài viết (hoặc một lượng lớn đủ để bao phủ sitemap)
    // Giả định API trả về `slug` và `publishedAt` (hoặc `updatedAt`) cho mỗi bài viết
    const blogsResponse = await apis.getBlogs({ limit: 1000, page: 1 });
    if (blogsResponse && blogsResponse.success && Array.isArray(blogsResponse.data?.blogs)) {
      const blogs: BlogLight[] = blogsResponse.data.blogs.map(b => ({
        slug: b.slug,
        publishedAt: b.publishedAt || b.updatedAt || currentDate // Sử dụng publishedAt, fallback về updatedAt, rồi đến currentDate
      }));
      blogRoutes = blogs.map((blog) => ({
        url: `${BASE_URL}/bai-viet/${blog.slug}`,
        lastModified: new Date(blog.publishedAt!).toISOString(), // Thêm ! vì đã có fallback
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } else {
      console.error("Sitemap: Không thể lấy dữ liệu bài viết hoặc dữ liệu không hợp lệ.");
    }
  } catch (error) {
    console.error("Sitemap: Lỗi khi fetch bài viết:", error);
  }

  return [
    ...staticRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
} 