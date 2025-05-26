import AboutClient from './about-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Giới Thiệu Kinh Đô Cá Cảnh",
  description:
    "Kinh Đô Cá Cảnh được sáng lập bởi những người yêu thích thủy sinh, chia sẻ đam mê cùng bạn! Liên hệ: số điện thoại - 0916098310, email - kinhdocacanh@gmail.com, địa chỉ: Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM - Hàn Thuyên, khu phố 6 P, Thủ Đức, Hồ Chí Minh, Việt Nam",
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
    "Kinh Đô Cá Cảnh",
    "kinh đô cá cảnh",
    "kinhdocacanh",
    "kinhdocacanh.shop",
    "cá cảnh",
    "thủy sinh",
    "mua cá cảnh online",
    "mua cá cảnh tphcm",
    "mua cá cảnh đẹp",
    "mua cá cảnh giá rẻ",
    "cá cảnh đẹp",
    "cá cảnh đẹp giá rẻ",
    "cá cảnh đẹp tphcm",
    "cá cảnh làng đại học",
    "cá cảnh thủ đức",
    "giới thiệu kinh đô cá cảnh",
  ],
  openGraph: {
    title: "Giới thiệu",
    description:
      "Kinh Đô Cá Cảnh được sáng lập bởi những người yêu thích thủy sinh, chia sẻ đam mê cùng bạn! Liên hệ: số điện thoại - 0916098310, email - kinhdocacanh@gmail.com, địa chỉ: Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM - Hàn Thuyên, khu phố 6 P, Thủ Đức, Hồ Chí Minh, Việt Nam",
    url: "https://kinhdocacanh.shop/ve-chung-toi",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    images: [
      {
        url: "https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/gioi-thieu_pn5rqz.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh - Giới thiệu",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giới thiệu",
    description:
      "Kinh Đô Cá Cảnh được sáng lập bởi những người yêu thích thủy sinh, chia sẻ đam mê cùng bạn! Liên hệ: số điện thoại - 0916098310, email - kinhdocacanh@gmail.com, địa chỉ: Trường Đại học Công nghệ Thông tin - ĐHQG TP.HCM - Hàn Thuyên, khu phố 6 P, Thủ Đức, Hồ Chí Minh, Việt Nam",
    images: ["https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/gioi-thieu_pn5rqz.png"],
    creator: "@kinhdocacanh",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/ve-chung-toi",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};
export default function AboutPage() {
  return <AboutClient />;
} 