import SearchClient from "./search-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm",
  description: "Tìm kiếm mọi thứ từ cá cảnh, thức ăn, thuốc cho cá, phụ kiện cá cảnh, bể cá cảnh tại Kinh Đô Cá Cảnh, mọi thứ trong tầm tay của bạn",
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
  keywords: [ "kinh đô cá cảnh", "kinh do ca canh", "kinhdocacanh.shop", "kinhdocacanh", "tìm kiếm" ],
  openGraph: {
    title: "Tìm kiếm",
    description: "Tìm kiếm sản phẩm tại Kinh Đô Cá Cảnh",
    url: "https://kinhdocacanh.shop/tim-kiem",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tìm kiếm",
    description: "Tìm kiếm sản phẩm tại Kinh Đô Cá Cảnh",
    creator: "@kinhdocacanh",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/tim-kiem",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};

export default function SearchPage() {
  return <SearchClient />;
}

