import type { Metadata } from "next";
import { Montserrat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import LayoutRoot from "@/components/layout/RootLayout";
import { MetadataProvider } from "@/contexts/MetadataContext";

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
  title: "Kinh Đô Cá Cảnh | Cửa hàng cá cảnh uy tín hàng đầu",
  description:
    "Kinh Đô Cá Cảnh - Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý. Giao hàng toàn quốc.",
  keywords:
    "cá cảnh, thủy sinh, bể cá, phụ kiện cá cảnh, thức ăn cá cảnh, cá đẹp, cá ngoại nhập",
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
        <MetadataProvider>
          <LayoutRoot>
            {children}
          </LayoutRoot>
        </MetadataProvider>
      </body>
    </html>
  );
}
