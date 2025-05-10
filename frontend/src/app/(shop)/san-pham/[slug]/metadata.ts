import { Metadata, ResolvingMetadata } from 'next';
import { apis } from '../../../../services/apis';

// Hàm để lấy metadata động dựa trên slug của sản phẩm
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // Thử lấy dữ liệu sản phẩm từ API
    const products = await apis.getProducts({ limit: 100 });
    const product = products.success 
      ? products.data.products.find(p => p.slug === params.slug) 
      : null;
    
    if (product) {
      // Lấy thông tin chi tiết sản phẩm nếu tìm thấy slug
      const productDetail = await apis.getProductDetail(product._id);
      
      if (productDetail.success && productDetail.data.pd_meta) {
        const meta = productDetail.data.pd_meta;
        
        // Đảm bảo type trong OpenGraph là một giá trị hợp lệ
        const ogType = meta.ogType === 'product' ? 'website' : 
                      (meta.ogType === 'article' || meta.ogType === 'book' || 
                       meta.ogType === 'profile' || meta.ogType === 'website') 
                      ? meta.ogType : 'website';
        
        return {
          title: meta.title || `${productDetail.data.pd_name} | Kinh Đô Cá Cảnh`,
          description: meta.metaDescription,
          keywords: meta.keywords,
          openGraph: {
            title: meta.ogTitle || meta.title || productDetail.data.pd_name,
            description: meta.ogDescription || meta.metaDescription,
            images: [meta.ogImage || meta.image],
            url: `https://kinhdocacanh.com${meta.canonical}`,
            siteName: 'Kinh Đô Cá Cảnh',
            locale: 'vi_VN',
            type: ogType,
          },
          twitter: {
            card: 'summary_large_image',
            title: meta.twitterTitle || meta.title || productDetail.data.pd_name,
            description: meta.twitterDescription || meta.metaDescription,
            images: [meta.twitterImage || meta.image],
          }
        };
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy metadata:', error);
  }
  
  // Metadata mặc định nếu không lấy được từ API
  return {
    title: 'Chi tiết sản phẩm | Kinh Đô Cá Cảnh',
    description: 'Thông tin chi tiết sản phẩm tại Kinh Đô Cá Cảnh.',
    openGraph: {
      title: 'Chi tiết sản phẩm | Kinh Đô Cá Cảnh',
      description: 'Thông tin chi tiết sản phẩm tại Kinh Đô Cá Cảnh.',
      siteName: 'Kinh Đô Cá Cảnh',
      locale: 'vi_VN',
      type: 'website',
    },
  };
} 