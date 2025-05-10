"use client";

import { useEffect, useMemo } from 'react';
import { useMetadata } from "@/contexts/MetadataContext";

export default function AboutClient() {
  const { updateMetadata } = useMetadata();
  
  // Tạo metadata cho trang giới thiệu
  const metadata = useMemo(() => ({
    title: "Giới thiệu | Kinh Đô Cá Cảnh",
    description: "Kinh Đô Cá Cảnh - Cửa hàng cá cảnh uy tín hàng đầu Việt Nam với hơn 10 năm kinh nghiệm. Tìm hiểu về câu chuyện, sứ mệnh và tầm nhìn của chúng tôi.",
    keywords: "giới thiệu kinh đô cá cảnh, lịch sử kinh đô cá cảnh, cửa hàng cá cảnh uy tín"
  }), []);

  // Cập nhật metadata
  useEffect(() => {
    updateMetadata(metadata);
  }, [metadata, updateMetadata]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Giới thiệu về Kinh Đô Cá Cảnh
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="lead text-xl text-gray-600 mb-8">
            Kinh Đô Cá Cảnh là chuỗi cửa hàng cá cảnh uy tín hàng đầu Việt Nam, chuyên cung cấp các loại cá cảnh, thủy sinh, phụ kiện và thức ăn với chất lượng tốt nhất.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Câu chuyện của chúng tôi</h2>
          <p>
            Kinh Đô Cá Cảnh được thành lập vào năm 2010 bởi những người yêu thích cá cảnh và thủy sinh. Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đơn vị tiên phong trong việc cung cấp các sản phẩm chất lượng cao với giá cả hợp lý cho người chơi cá cảnh tại Việt Nam.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Sứ mệnh</h2>
          <p>
            Sứ mệnh của chúng tôi là mang đến cho khách hàng những sản phẩm cá cảnh và thủy sinh chất lượng cao, đồng thời nâng cao nhận thức về tầm quan trọng của việc bảo tồn môi trường thủy sinh. Chúng tôi cam kết cung cấp dịch vụ tư vấn chuyên nghiệp và hỗ trợ khách hàng trong việc xây dựng và duy trì một hệ thống thủy sinh khỏe mạnh và bền vững.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Tầm nhìn</h2>
          <p>
            Trở thành chuỗi cửa hàng cá cảnh và thủy sinh hàng đầu Việt Nam, được khách hàng tin tưởng và lựa chọn. Chúng tôi không ngừng cải tiến và mở rộng danh mục sản phẩm, đồng thời nâng cao chất lượng dịch vụ để đáp ứng nhu cầu ngày càng cao của khách hàng.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Giá trị cốt lõi</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Chất lượng:</strong> Cam kết cung cấp sản phẩm chất lượng cao.</li>
            <li><strong>Trung thực:</strong> Luôn trung thực và minh bạch trong mọi giao dịch.</li>
            <li><strong>Đổi mới:</strong> Không ngừng đổi mới và cập nhật xu hướng mới.</li>
            <li><strong>Khách hàng:</strong> Đặt khách hàng làm trung tâm của mọi hoạt động.</li>
            <li><strong>Môi trường:</strong> Cam kết bảo vệ môi trường và thúc đẩy phát triển bền vững.</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 