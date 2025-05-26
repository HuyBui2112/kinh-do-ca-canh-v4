import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Đăng nhập hoặc đăng ký tài khoản Kinh Đô Cá Cảnh để quản lý đơn hàng, lưu sản phẩm yêu thích và nhận ưu đãi thành viên.",
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
  keywords: [ "kinh đô cá cảnh", "kinh do ca canh", "kinhdocacanh.shop", "kinhdocacanh", "đăng ký" ],
  openGraph: {
    title: "Đăng ký",
    description: "Đăng ký tài khoản tại Kinh Đô Cá Cảnh",
    url: "https://kinhdocacanh.shop/dang-ky",
    siteName: "Kinh Đô Cá Cảnh",
    images: [
      {
        url: "https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/dang-ky_zhiumo.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh - Đăng ký",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đăng ký",
    description: "Đăng ký tài khoản tại Kinh Đô Cá Cảnh",
    images: ["https://res.cloudinary.com/dnfgplu95/image/upload/v1748302319/dang-ky_zhiumo.png"],
    creator: "@kinhdocacanh",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/dang-ky",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};
export default function RegisterPage() {
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumbs items={[{ slug: "/dang-ky", label: "Đăng ký" }]} />
      </div>
      <div className="mx-auto pb-8">
        <RegisterForm />
      </div>
    </div>
  );
}
