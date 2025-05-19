import type { Metadata } from "next";
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import LayoutRoot from "@/components/layout/RootLayout";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["vietnamese", "latin"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Metadata mặc định cho toàn bộ website
export const metadata: Metadata = {
  metadataBase: new URL("https://cqd73j5z2nsdeivs77ln2echui.srv.us/"),
  title: {
    default: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    template: "%s | Kinh Đô Cá Cảnh",
  },
  description:
    "Kinh Đô Cá Cảnh - Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý. Giao hàng toàn quốc.",
  keywords: [
    "mua cá cảnh",
    "mua cá betta",
    "cá cảnh",
    "blog cá cảnh",
    "kinh đô cá cảnh",
  ],
  openGraph: {
    title: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    description:
      "Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý. Giao hàng toàn quốc.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh Logo",
      },
    ],
    url: "https://kinhdocacanh.com",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    description:
      "Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý. Giao hàng toàn quốc.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${montserrat.variable} ${beVietnamPro.variable}`}
    >
      <body>
        <LayoutRoot>{children}</LayoutRoot>
      </body>
    </html>
  );
}
