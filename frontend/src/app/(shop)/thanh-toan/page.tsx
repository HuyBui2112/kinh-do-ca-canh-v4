import CheckoutClient from "./checkout-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh Toán Đơn Hàng",
  description: "Hoàn tất đơn hàng nhanh chóng và an toàn tại Kinh Đô Cá Cảnh. Hỗ trợ nhiều hình thức thanh toán và giao hàng tận nơi.",
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
  keywords: [ "kinh đô cá cảnh", "kinh do ca canh", "kinhdocacanh.shop", "kinhdocacanh", "thanh toán" ],
  openGraph: {
    title: "Thanh toán",
    description: "Hoàn tất đơn hàng nhanh chóng và an toàn tại Kinh Đô Cá Cảnh. Hỗ trợ nhiều hình thức thanh toán và giao hàng tận nơi.",
    url: "https://kinhdocacanh.shop/thanh-toan",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thanh toán",
    description: "Hoàn tất đơn hàng nhanh chóng và an toàn tại Kinh Đô Cá Cảnh. Hỗ trợ nhiều hình thức thanh toán và giao hàng tận nơi.",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/thanh-toan",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

