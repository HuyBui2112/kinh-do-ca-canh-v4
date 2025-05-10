"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Metadata } from 'next';

// Định nghĩa cấu trúc metadata
interface MetadataContextType {
  updateMetadata: (metadata: Partial<Metadata>) => void;
  currentMetadata: Partial<Metadata>;
}

// Giá trị mặc định cho metadata
const defaultMetadata: Partial<Metadata> = {
  title: "Kinh Đô Cá Cảnh | Cửa hàng cá cảnh uy tín hàng đầu",
  description: "Kinh Đô Cá Cảnh - Chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn cho cá với chất lượng cao và giá cả hợp lý. Giao hàng toàn quốc.",
  keywords: "cá cảnh, thủy sinh, bể cá, phụ kiện cá cảnh, thức ăn cá cảnh, cá đẹp, cá ngoại nhập",
};

// Tạo context với giá trị mặc định
const MetadataContext = createContext<MetadataContextType>({
  updateMetadata: () => {},
  currentMetadata: defaultMetadata,
});

// Hook để dễ dàng sử dụng context
export const useMetadata = () => useContext(MetadataContext);

// Provider component
interface MetadataProviderProps {
  children: ReactNode;
}

export const MetadataProvider = ({ children }: MetadataProviderProps) => {
  const [currentMetadata, setCurrentMetadata] = useState<Partial<Metadata>>(defaultMetadata);

  // Sử dụng useCallback để đảm bảo hàm updateMetadata không thay đổi qua mỗi lần render
  const updateMetadata = useCallback((metadata: Partial<Metadata>) => {
    // Cập nhật metadata mới
    setCurrentMetadata(prev => ({
      ...prev,
      ...metadata,
    }));

    // Cập nhật thẻ title trong DOM
    if (metadata.title && typeof window !== 'undefined') {
      document.title = typeof metadata.title === 'string' 
        ? metadata.title 
        : String(metadata.title);
    }

    // Cập nhật thẻ description trong DOM
    if (metadata.description && typeof window !== 'undefined') {
      // Tìm thẻ meta description hiện có hoặc tạo mới
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      
      metaDescription.setAttribute('content', metadata.description as string);
    }
  }, []);

  // Memorize giá trị context để tránh re-render không cần thiết
  const contextValue = useMemo(() => ({
    updateMetadata,
    currentMetadata
  }), [updateMetadata, currentMetadata]);

  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
}; 