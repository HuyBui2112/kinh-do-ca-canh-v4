import ProfileClient from "./profile-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  description: "Quản lý thông tin cá nhân, đơn hàng và sản phẩm yêu thích tại Kinh Đô Cá Cảnh. Trải nghiệm mua sắm cá cảnh đơn giản, thuận tiện.",
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
  keywords: [ "kinh đô cá cảnh", "kinh do ca canh", "kinhdocacanh.shop", "kinhdocacanh", "cá nhân" ],
  openGraph: {
    title: "Cá nhân",
    description: "Quản lý thông tin cá nhân, đơn hàng và sản phẩm yêu thích tại Kinh Đô Cá Cảnh. Trải nghiệm mua sắm cá cảnh đơn giản, thuận tiện.",
    url: "https://kinhdocacanh.shop/ca-nhan",
    siteName: "Kinh Đô Cá Cảnh",
    images: [
      {
        url: "https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/tai-khoan_jdae5c.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh - Cá nhân",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cá nhân",
    description: "Quản lý thông tin cá nhân, đơn hàng và sản phẩm yêu thích tại Kinh Đô Cá Cảnh. Trải nghiệm mua sắm cá cảnh đơn giản, thuận tiện.",
    images: ["https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/tai-khoan_jdae5c.png"],
    creator: "@kinhdocacanh",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/ca-nhan",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};

export default function ProfilePage() {
  return <ProfileClient />;
}
