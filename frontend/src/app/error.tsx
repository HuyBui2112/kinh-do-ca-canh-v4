'use client';

import React from "react";
import { useEffect } from "react";
import Link from "next/link";

/**
 * Component xử lý lỗi cho toàn bộ ứng dụng
 * Hiển thị khi có lỗi xảy ra trong quá trình render
 * 
 * @param error - Lỗi được truyền vào từ Next.js
 * @param reset - Hàm để thử render lại component gây lỗi
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tùy chọn: Ghi log lỗi vào dịch vụ giám sát lỗi
    console.error('Lỗi ứng dụng:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Đã xảy ra lỗi!</h1>
        <p className="mt-4 text-lg text-gray-700">
          Thật không may, đã có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn.
        </p>
        
        <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Thử lại
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
          >
            Quay về trang chủ
          </Link>
        </div>
        
        <div className="mt-6 text-gray-500">
          <p>Nếu lỗi vẫn tiếp tục xảy ra, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>
        </div>
      </div>
    </div>
  );
} 