"use client";

import { useEffect, useMemo } from "react";
import { Metadata } from "next";
import { useMetadata } from "@/contexts/MetadataContext";

/**
 * Hook để cập nhật metadata cho các trang
 * 
 * @param title - Tiêu đề trang
 * @param description - Mô tả trang (optional)
 * @param additionalMeta - Metadata bổ sung (optional)
 */
export function usePageMetadata(
  title: string,
  description?: string,
  additionalMeta: Partial<Metadata> = {}
) {
  // Lấy hàm updateMetadata từ context
  const { updateMetadata } = useMetadata();

  // Sử dụng useMemo để tránh tạo đối tượng mới mỗi lần render
  const metadata = useMemo(() => ({
    title: title ? `${title} | Kinh Đô Cá Cảnh` : "Kinh Đô Cá Cảnh | Cửa hàng cá cảnh uy tín hàng đầu",
    description: description || "Kinh Đô Cá Cảnh - Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý.",
    ...additionalMeta
  }), [title, description, additionalMeta]);

  // Sử dụng useEffect để cập nhật metadata khi metadata thay đổi
  useEffect(() => {
    updateMetadata(metadata);
  }, [metadata, updateMetadata]);
} 