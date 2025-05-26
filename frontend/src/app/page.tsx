import HomeClient from "./home-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kinh Đô Cá Cảnh | Cửa Hàng Cá Cảnh, Phụ Kiện & Thủy Sinh",
  description:
    "Kinh Đô Cá Cảnh – Cửa hàng cá cảnh uy tín tại TPHCM. Cá Betta, cá vàng, phụ kiện, cây thủy sinh, thức ăn và thuốc cho cá.",
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
    "Kinh Đô Cá Cảnh",
    "kinhdocacanh.shop",
    "kinh đô cá cảnh",
    "cửa hàng cá cảnh tphcm",
    "shop cá cảnh tphcm",
    "mua cá cảnh online",
    "mua bể cá cảnh",
    "cá cảnh",
    "thức ăn cho cá cảnh",
    "cám cho cá",
    "bột cho cá",
    "thuốc cho cá cảnh",
    "kháng sinh cho cá",
    "thuốc trị nấm cho cá",
    "cây thủy sinh",
    "cá betta",
    "mua bảy màu",
    "cá vàng",
    "cá guppy",
    "cá rồng",
    "cá chuột",
    "cá neon",
    "phụ kiện bể cá",
    "phụ kiện hồ cá",
    "bể cá cảnh mini",
    "thủy sinh tphcm",
    "cá cảnh làng đại học",
  ],
  openGraph: {
    title: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    description:
      "Kinh Đô Cá Cảnh – Cửa hàng cá cảnh uy tín tại TPHCM. Cá Betta, cá vàng, phụ kiện, cây thủy sinh, thức ăn và thuốc cho cá.",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    description:
      "Kinh Đô Cá Cảnh – Cửa hàng cá cảnh uy tín tại TPHCM. Cá Betta, cá vàng, phụ kiện, cây thủy sinh, thức ăn và thuốc cho cá.",
    creator: "@kinhdocacanh",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
  publisher: "Kinh Đô Cá Cảnh",
};

export default function HomePage() {
  return <HomeClient />;
}
