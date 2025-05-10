import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'example.com',      // Cho phép hình ảnh từ example.com
      'localhost',        // Cho phép hình ảnh từ localhost
      'images.kinhdocacanh.com', // Tên miền chứa hình ảnh của bạn
      'kinhdocacanh.com',  // Domain chính
      'res.cloudinary.com' // Cloudinary - dịch vụ lưu trữ hình ảnh
    ],
    // Hoặc có thể sử dụng remotePatterns để chi tiết hơn
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.kinhdocacanh.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/*/image/upload/**',
      }
    ]
  }
};

export default nextConfig;
