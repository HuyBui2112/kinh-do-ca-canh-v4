# Kinh Đô Cá Cảnh - Frontend

## Hệ thống Metadata Động

Dự án này sử dụng hệ thống metadata động để tối ưu SEO cho từng trang. Dưới đây là hướng dẫn cách triển khai và sử dụng hệ thống này.

### Cấu trúc

1. **MetadataContext** (`src/contexts/MetadataContext.tsx`)
   - Cung cấp Context API để quản lý và cập nhật metadata trong toàn bộ ứng dụng.
   - Tự động cập nhật thẻ `title` và `meta description` trong DOM.

2. **useMetadata Hook**
   - Hook để sử dụng trực tiếp từ Context API.
   - Cung cấp chức năng updateMetadata để thiết lập metadata cho mỗi trang.

3. **Cơ chế hoạt động**
   - Metadata mặc định được cấu hình trong `app/layout.tsx` cho SEO tĩnh.
   - Mỗi trang có thể ghi đè metadata động thông qua các hook.

### Cách sử dụng

#### Trong các client components:

```tsx
"use client";

import { useEffect, useMemo } from "react";
import { useMetadata } from "@/contexts/MetadataContext";

export default function YourClientComponent() {
  const { updateMetadata } = useMetadata();
  
  // Sử dụng useMemo để tránh tạo đối tượng mới mỗi lần render
  const metadata = useMemo(() => ({
    title: "Tiêu đề trang | Kinh Đô Cá Cảnh",
    description: "Mô tả chi tiết về trang (tối đa 160 ký tự)",
    keywords: "từ khóa 1, từ khóa 2, từ khóa 3"
  }), []);

  // Sử dụng useEffect để cập nhật metadata
  useEffect(() => {
    updateMetadata(metadata);
  }, [metadata, updateMetadata]);

  return (
    <div>
      {/* Nội dung trang */}
    </div>
  );
}
```

#### Với dữ liệu động:

```tsx
"use client";

import { useEffect, useMemo } from "react";
import { useMetadata } from "@/contexts/MetadataContext";

export default function DynamicPage({ data }) {
  const { updateMetadata } = useMetadata();
  
  // Tạo metadata dựa trên dữ liệu động
  const metadata = useMemo(() => {
    if (!data) return null;
    
    return {
      title: `${data.title} | Kinh Đô Cá Cảnh`,
      description: data.description?.substring(0, 160).replace(/<[^>]*>/g, '') || "Mô tả mặc định",
      keywords: `${data.keywords}, từ khóa chung`
    };
  }, [data]);

  // Cập nhật metadata nếu có dữ liệu
  useEffect(() => {
    if (metadata) {
      updateMetadata(metadata);
    }
  }, [metadata, updateMetadata]);

  return (
    <div>
      {/* Nội dung trang */}
    </div>
  );
}
```

### Cách thêm metadata cho trang mới

1. Tạo một trang server component trong thư mục `app/`:
   ```tsx
   // app/ten-trang/page.tsx
   import ClientComponent from './client-component';
   
   export default function Page() {
     return <ClientComponent />;
   }
   ```

2. Tạo một client component với metadata:
   ```tsx
   // app/ten-trang/client-component.tsx
   "use client";
   
   import { useEffect, useMemo } from "react";
   import { useMetadata } from "@/contexts/MetadataContext";
   
   export default function ClientComponent() {
     const { updateMetadata } = useMetadata();
     
     const metadata = useMemo(() => ({
       title: "Tiêu đề trang | Kinh Đô Cá Cảnh",
       description: "Mô tả trang",
       keywords: "từ khóa 1, từ khóa 2"
     }), []);
     
     useEffect(() => {
       updateMetadata(metadata);
     }, [metadata, updateMetadata]);
     
     return (
       <div>
         {/* Nội dung trang */}
       </div>
     );
   }
   ```

### Lưu ý quan trọng

- **QUAN TRỌNG:** Luôn sử dụng `useMemo` để tạo đối tượng metadata để tránh vòng lặp vô hạn.
- Metadata động chỉ hoạt động ở phía client (client-side).
- Metadata tĩnh trong `app/layout.tsx` được sử dụng cho SEO ban đầu và server-side rendering.
- Nên giữ mô tả (description) khoảng 150-160 ký tự để tối ưu cho SEO.
- Luôn cung cấp title rõ ràng, ngắn gọn và chứa từ khóa quan trọng.

### Ví dụ

Xem các ví dụ triển khai trong:
- `app/home-client.tsx` - Trang chủ
- `app/gioi-thieu/about-client.tsx` - Trang giới thiệu
- `app/(shop)/san-pham/products-client.tsx` - Trang danh sách sản phẩm
- `app/(shop)/san-pham/[slug]/product-detail-client.tsx` - Trang chi tiết sản phẩm
