import { Metadata } from "next";
import BlogDetailClient from "./blog-detail-client";
import { apis } from "@/services/apis";

// Định nghĩa type đúng chuẩn cho props
type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await apis.getBlogBySlug(slug);

    if (response.success && response.data) {
      const blog = response.data;
      const meta = blog.meta;

      return {
        title: meta.title,
        description: meta.metaDescription,
        keywords: meta.keywords,
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
        alternates: {
          canonical: meta.canonical,
        },
        openGraph: {
          title: meta.ogTitle || meta.title,
          description: meta.ogDescription || meta.metaDescription,
          url: meta.canonical,
          siteName: "Kinh Đô Cá Cảnh",
          images: [
            {
              url: meta.ogImage || meta.image || blog.blog_image,
            },
          ],
          locale: "vi_VN",
          type: meta.ogType === "article" ? "article" : "website",
        },
        twitter: {
          card: "summary_large_image",
          title: meta.twitterTitle || meta.title,
          description: meta.twitterDescription || meta.metaDescription,
          images: [meta.twitterImage || meta.image || blog.blog_image],
        },
        authors: [{ name: blog.author }],
      };
    }
  } catch (error) {
    console.error(`Error fetching metadata for slug ${slug}:`, error);
  }

  return {};
}

export default async function BlogDetail({ params }: PageProps) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
