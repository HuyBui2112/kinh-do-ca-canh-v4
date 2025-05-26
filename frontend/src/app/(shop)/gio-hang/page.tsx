import CartClient from "./cart-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ Hàng Của Bạn",
  description: "Nơi bạn xem lại sản phẩm bạn đã chọn mua tại Kinh Đô Cá Cảnh. Cá cảnh, phụ kiện, thức ăn, thuốc – đủ mọi thứ cho bể cá của bạn.",
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
  keywords: [ "kinh đô cá cảnh", "kinh do ca canh", "kinhdocacanh.shop", "kinhdocacanh", "giỏ hàng" ],
  openGraph: {
    title: "Giỏ hàng",
    description: "Xem lại sản phẩm bạn đã chọn mua tại Kinh Đô Cá Cảnh. Cá cảnh, phụ kiện, thức ăn, thuốc – đủ mọi thứ cho bể cá của bạn.",
    url: "https://kinhdocacanh.shop/gio-hang",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giỏ hàng",
    description: "Xem lại sản phẩm bạn đã chọn mua tại Kinh Đô Cá Cảnh. Cá cảnh, phụ kiện, thức ăn, thuốc – đủ mọi thứ cho bể cá của bạn.",
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop/gio-hang",
  },
  authors: [
    {
      name: "Kinh Đô Cá Cảnh",
      url: "https://kinhdocacanh.shop",
    },
  ],
};

export default function CartPage() {
  return <CartClient />;
}

