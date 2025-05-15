'use client';

import React from "react";
import { useEffect } from "react";

/**
 * Component xử lý lỗi ở cấp độ cao nhất của ứng dụng
 * Chỉ hiển thị khi có lỗi nghiêm trọng xảy ra trong layout.tsx
 * 
 * Lưu ý: Component này thay thế hoàn toàn layout.tsx khi có lỗi
 * nên cần phải tự định nghĩa HTML, body, v.v.
 * 
 * @param error - Lỗi được truyền vào từ Next.js
 * @param reset - Hàm để thử render lại ứng dụng
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi toàn cục
    console.error('Lỗi nghiêm trọng trong ứng dụng:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-gray-100">
          <div className="p-8 bg-white rounded-lg shadow-xl max-w-md w-full">
            <h1 className="text-3xl font-bold text-red-600">Lỗi hệ thống</h1>
            <p className="mt-4 text-gray-700">
              Đã xảy ra lỗi nghiêm trọng trong hệ thống. Chúng tôi đã ghi nhận vấn đề này.
            </p>
            
            <div className="mt-8">
              <button
                onClick={reset}
                className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Thử tải lại ứng dụng
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Mã lỗi: {error.digest}</p>
              <p className="mt-2">
                Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với đội hỗ trợ hoặc quay lại sau.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 