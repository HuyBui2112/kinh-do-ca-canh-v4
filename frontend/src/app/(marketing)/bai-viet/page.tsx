import BlogListClient from "./blog-list-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bài viết",
  description:
    "Mua sắm các loại cá cảnh, thức ăn, phụ kiện, thuốc và bể cá chất lượng cao tại Kinh Đô Cá Cảnh. Đa dạng sản phẩm, giá cả hợp lý, giao hàng nhanh chóng.",
  keywords: [
    "cá cảnh",
    "thức ăn cá",
    "phụ kiện cá cảnh",
    "bể cá",
    "thuốc cho cá",
  ],
  openGraph: {
    title: "Sản phẩm",
    description:
      "Mua sắm các loại cá cảnh, thức ăn, phụ kiện, thuốc và bể cá chất lượng cao tại Kinh Đô Cá Cảnh.",
    url: "https://kinhdocacanh.com/bai-viet",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
};

export default function BlogList() {
  return <BlogListClient />;
}
