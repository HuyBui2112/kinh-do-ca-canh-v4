import ProductDetailClient from "./product-detail-client";
import { Metadata, ResolvingMetadata } from "next";
import { apis } from "@/services/apis";
import { ProductDetail } from "@/utils/types/product";

// Định nghĩa kiểu dữ liệu cho params
type Props = {
  params: {
    slug: string;
  };
};

// Tạo metadata động dựa trên thông tin sản phẩm
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Lấy slug từ params
  const { slug } = params;

  try {
    // Lấy danh sách sản phẩm với slug tương ứng
    const productsResponse = await apis.getProducts({ slug });

    // Tìm sản phẩm chính xác với slug
    const exactProduct =
      productsResponse.success && productsResponse.data.products.length > 0
        ? productsResponse.data.products.find((p) => p.slug === slug)
        : null;

    // Nếu không tìm thấy sản phẩm, trả về metadata mặc định
    if (!exactProduct) {
      return {
        title: "Sản phẩm không tồn tại",
        description: "Không tìm thấy thông tin sản phẩm này.",
      };
    }

    // Lấy thông tin chi tiết sản phẩm
    const productDetailResponse = await apis.getProductDetail(exactProduct._id);
    const productDetail: ProductDetail = productDetailResponse.data;

    // Lấy metadata từ parent (metadata mặc định)
    const previousImages = (await parent).openGraph?.images || [];

    // Nếu sản phẩm có metadata tùy chỉnh, sử dụng nó
    if (productDetail.pd_meta) {
      const { pd_meta } = productDetail;

      return {
        title: pd_meta.title || productDetail.pd_name,
        description: pd_meta.metaDescription || "",
        keywords: pd_meta.keywords || [],
        openGraph: {
          title: pd_meta.ogTitle || pd_meta.title || productDetail.pd_name,
          description: pd_meta.ogDescription || pd_meta.metaDescription || "",
          images: pd_meta.ogImage ? [pd_meta.ogImage] : undefined,
          type: pd_meta.ogType === "product" ? "website" : "website", // Đảm bảo type hợp lệ
          url: pd_meta.canonical || `/san-pham/${slug}`,
        },
        twitter: {
          title: pd_meta.twitterTitle || pd_meta.title || productDetail.pd_name,
          description:
            pd_meta.twitterDescription || pd_meta.metaDescription || "",
          images: pd_meta.twitterImage ? [pd_meta.twitterImage] : undefined,
        },
        alternates: {
          canonical: pd_meta.canonical || `/san-pham/${slug}`,
        },
      };
    }

    // Nếu không có metadata tùy chỉnh, tạo metadata mặc định từ thông tin sản phẩm
    const mainImage =
      productDetail.pd_image.length > 0
        ? productDetail.pd_image[0].url
        : undefined;

    return {
      title: productDetail.pd_name,
      description: `${productDetail.pd_name} - ${
        productDetail.pd_category
      } tại Kinh Đô Cá Cảnh. Giá: ${productDetail.pd_price.sell_price.toLocaleString(
        "vi-VN"
      )}đ.`,
      openGraph: {
        title: productDetail.pd_name,
        description: `${productDetail.pd_name} - ${productDetail.pd_category} tại Kinh Đô Cá Cảnh.`,
        images: mainImage ? [mainImage] : undefined,
        type: "website",
        url: `/san-pham/${slug}`,
      },
      alternates: {
        canonical: `/san-pham/${slug}`,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy metadata sản phẩm:", error);

    // Trả về metadata mặc định nếu có lỗi
    return {
      title: "Chi tiết sản phẩm",
      description: "Thông tin chi tiết sản phẩm tại Kinh Đô Cá Cảnh.",
    };
  }
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
