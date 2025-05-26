import type { Metadata, Viewport } from "next";
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
  // metadataBase: new URL("https://kinhdocacanh.shop/"),
  metadataBase: new URL("https://cqd73j5z2nsdeivs77ln2echui.srv.us/"),
  title: {
    default: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    template: "%s | Kinh Đô Cá Cảnh",
  },
  description:
    "Kinh Đô Cá Cảnh – Cửa hàng cá cảnh uy tín tại TPHCM. Cá Betta, cá vàng, phụ kiện, cây thủy sinh, thức ăn và thuốc cho cá.",
  keywords: [
    "Kinh Đô Cá Cảnh",
    "kinh đô cá cảnh",
    "kinh do ca canh",
    "kinhdocacanh",
    "kinhdocacanh.shop",
    "thủy sinh",
    "cửa hàng cá cảnh tphcm",
    "shop cá cảnh tphcm",
    "vi sinh cho cá cảnh",
    "cá cảnh làng đại học",
    "mua cá cảnh",
    "mua cá cảnh online",
    "mua cá cảnh đẹp",
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
    "hồ cá cảnh mini",
    "kiến thức cá cảnh",
    "hướng dẫn nuôi cá cảnh",
    "các loài cá cảnh",
    "thuy sinh",
    "cua hang ca canh tphcm",
    "shop ca canh tphcm",
    "ca canh làng đại học",
    "mua ca canh",
    "mua ba ca canh",
    "ca canh",
    "thac an cho ca canh",
    "cam cho ca",
    "bot cho ca",
    "thuoc cho ca canh",
    "khang sinh cho ca",
    "thuoc tri nam cho ca",
    "cay thuy sinh",
    "ca betta",
    "mua bay mau",
    "ca vang",
    "ca guppy",
    "ca rong",
    "ca chuot",
    "ca neon",
    "phu kien be ca",
    "phu kien ho ca",
    "be ca canh mini",
    "ho ca canh mini",
    "kien thuc ca canh",
    "huong dan nuoi ca canh",
    "cac loai ca canh",
  ],
  openGraph: {
    title: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    description:
      "Kinh Đô Cá Cảnh – Cửa hàng cá cảnh uy tín tại TPHCM. Cá Betta, cá vàng, phụ kiện, cây thủy sinh, thức ăn và thuốc cho cá.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kinh Đô Cá Cảnh Logo",
      },
    ],
    url: "https://kinhdocacanh.shop",
    siteName: "Kinh Đô Cá Cảnh",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinh Đô Cá Cảnh | Nơi đam mê hóa thành đại dương",
    description:"Kinh Đô Cá Cảnh – Cửa hàng cá cảnh uy tín tại TPHCM. Cá Betta, cá vàng, phụ kiện, cây thủy sinh, thức ăn và thuốc cho cá.",
    images: ["/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://kinhdocacanh.shop",
  },
};

// Cấu hình viewport được tách ra thành export riêng
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <body className="min-w-[340px]">
        <LayoutRoot>{children}</LayoutRoot>
      </body>
    </html>
  );
}
