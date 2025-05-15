import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center">
        {/* Spinner với hiệu ứng quay */}
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Đang tải...</h2>
        <p className="mt-2 text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
} 