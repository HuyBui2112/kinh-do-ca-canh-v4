import BlogListClient from "./blog-list-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiến Thức Nuôi Cá Cảnh, Phụ Kiện, Cách Chăm Sóc",
  description:
    "Chia sẻ kinh nghiệm nuôi cá cảnh, cách chọn phụ kiện, xử lý cá bệnh và chăm sóc bể cá. Cập nhật kiến thức hữu ích từ Kinh Đô Cá Cảnh.",
  publisher: "Kinh Đô Cá Cảnh",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "cá cảnh",
    "kinh đô cá cảnh",
    "kinhdocacanh",
    "kinhdocacanh.shop",
    "cá cảnh đẹp",
    "cá betta",
    "cá bảy màu",
    "cá guppy",
    "cá vàng",
    "cá rồng",
    "cá neon",
    "cá chuột",
    "cách nuôi cá cảnh",
    "cá cảnh dễ nuôi",
    "cá cảnh dễ chăm sóc",
    "các loại cá cảnh đẹp",
    "các loài cá cảnh không cần oxy",
    "cá cảnh không cần oxy",
    "cách nuôi cá cảnh không cần oxy",
    "cách nuôi cá cảnh đơn giản",
    "dấu hiệu cá bị bệnh",
    "dấu hiệu cá cảnh bị bệnh",
    "cách phòng bệnh cho cá cảnh",
    "thuốc trị bệnh cho cá cảnh",
    "các bệnh ở cá cảnh",
    "nuôi cá cảnh cần gì",
    "nên nuôi cá cảnh gì",
    "cách nuôi cá cảnh nhỏ",
  ],
  openGraph: {
    title: "Kiến Thức Nuôi Cá Cảnh, Phụ Kiện, Cách Chăm Sóc",
    description:
      "Chia sẻ kinh nghiệm nuôi cá cảnh, cách chọn phụ kiện, xử lý cá bệnh và chăm sóc bể cá. Cập nhật kiến thức hữu ích từ Kinh Đô Cá Cảnh.",
    url: "https://kinhdocacanh.shop/bai-viet",
    siteName: "Kinh Đô Cá Cảnh",
    images: [
      {
        url: "https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/bai-viet_z0ua4a.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh - Bài viết",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kiến Thức Nuôi Cá Cảnh, Phụ Kiện, Cách Chăm Sóc",
    description:
      "Chia sẻ kinh nghiệm nuôi cá cảnh, cách chọn phụ kiện, xử lý cá bệnh và chăm sóc bể cá. Cập nhật kiến thức hữu ích từ Kinh Đô Cá Cảnh.",
    images: ["https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/bai-viet_z0ua4a.png"],
    creator: "@kinhdocacanh",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/bai-viet",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};

export default function BlogList() {
  return <BlogListClient />;
}
