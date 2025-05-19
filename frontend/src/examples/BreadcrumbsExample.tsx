"use client";

import React from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

/**
 * Component minh họa cách sử dụng Breadcrumbs trong các tình huống khác nhau
 */
const BreadcrumbsExample = () => {
  return (
    <div className="container mx-auto p-6 space-y-10">
      <section>
        <h2 className="text-xl font-bold mb-3">Trang Sản phẩm cơ bản</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/san-pham', label: 'Sản phẩm' }
            ]} 
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Trang Danh mục sản phẩm</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/san-pham', label: 'Sản phẩm' },
              { slug: '/san-pham/ca-canh', label: 'Cá cảnh' }
            ]} 
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Trang Chi tiết sản phẩm</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/san-pham', label: 'Sản phẩm' },
              { slug: '/san-pham/ca-canh', label: 'Cá cảnh' },
              { slug: '/san-pham/ca-canh/ca-vang', label: 'Cá vàng Ranchu' }
            ]} 
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Trang Giỏ hàng</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/gio-hang', label: 'Giỏ hàng' }
            ]} 
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Trang Thanh toán</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/gio-hang', label: 'Giỏ hàng' },
              { slug: '/thanh-toan', label: 'Thanh toán' }
            ]} 
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Tùy chỉnh (không hiển thị icon trang chủ)</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/tin-tuc', label: 'Tin tức' },
              { slug: '/tin-tuc/nuoi-ca', label: 'Nuôi cá' }
            ]} 
            showHomeIcon={false}
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Tùy chỉnh (không hiển thị trang chủ)</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Breadcrumbs 
            items={[
              { slug: '/lien-he', label: 'Liên hệ' }
            ]} 
            showHome={false}
          />
        </div>
      </section>
    </div>
  );
};

export default BreadcrumbsExample; 