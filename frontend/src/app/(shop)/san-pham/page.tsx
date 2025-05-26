import ProductsClient from "./products-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mua Cá Cảnh, Thức Ăn, Phụ Kiện & Cây Thủy Sinh",
  description:
    "Khám phá các dòng cá cảnh đẹp: Betta, cá rồng, cá bảy màu... cùng phụ kiện, thức ăn và thuốc cho cá. Giao hàng nhanh toàn quốc.",
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
    "cá cảnh đẹp",
    "mua cá cảnh",
    "mua cá cảnh online",
    "cá cảnh giá rẻ",
    "cá betta",
    "cá bảy màu",
    "cá guppy",
    "cá vàng",
    "cá rồng",
    "cá neon",
    "cá chuột",
    "mua bể cá mini",
    "bán hồ cá mini",
    "thức ăn cho cá cảnh",
    "thuốc cho cá cảnh",
    "kháng sinh cho cá cảnh",
    "thuốc trị nấm cho cá cảnh",
    "vi sinh cho cá cảnh",
    "bột cho cá",
    "cám cho cá",
    "phụ kiện hồ cá",
    "máy bơm nước",
    "máy lọc",
    "máy sủi oxy",
    "đèn bể cá",
    "đèn hồ cá",
    "thực vật thủy sinh",
    "cây thủy sinh",
    "thủy sinh",
    "bể cá cảnh",
    "bể cá mini",
    "hồ cá mini",
    "cá cảnh đẹp giá rẻ",
    "Kinh Đô Cá Cảnh",
    "kinh do ca canh",
    "kinhdocacanh.shop",
  ],
  twitter: {
    card: "summary_large_image",
    title: "Sản phẩm | Kinh Đô Cá Cảnh",
    description:
      "Mua sắm các loại cá cảnh, thức ăn, thuốc cho cá cảnh, phụ kiện, và bể cá chất lượng cao tại Kinh Đô Cá Cảnh.",
    images: [
      "https://res.cloudinary.com/dnfgplu95/image/upload/v1748124580/san-pham_kuaakz.png",
    ],
    creator: "@kinhdocacanh",
  },
  openGraph: {
    title: "Sản phẩm | Kinh Đô Cá Cảnh",
    description:
      "Mua sắm các loại cá cảnh, thức ăn, thuốc cho cá cảnh, phụ kiện, và bể cá chất lượng cao tại Kinh Đô Cá Cảnh.",
    images: [
      {
        url: "https://res.cloudinary.com/dnfgplu95/image/upload/v1748124580/san-pham_kuaakz.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh - Sản phẩm",
      },
    ],
    url: "san-pham",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/san-pham",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};

export default function ProductsPage() {
  return <ProductsClient />;
}
