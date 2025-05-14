import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">Không tìm thấy trang!</h2>
        <p className="mt-2 text-lg text-gray-600">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div className="mt-8">
          <Link 
            href="/" 
            className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Quay về trang chủ
          </Link>
        </div>
        
        <div className="mt-6 text-gray-500">
          <p>Bạn có thể trở về trang chủ hoặc thử tìm kiếm nội dung khác.</p>
        </div>
      </div>
    </div>
  );
} 