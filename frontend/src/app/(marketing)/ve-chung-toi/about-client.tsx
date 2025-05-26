import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Mail, Phone, Facebook, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="/images/banners/banner-1.png"
          alt="Kinh Đô Cá Cảnh - Banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          title="Kinh Đô Cá Cảnh - Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              KINH ĐÔ CÁ CẢNH
            </h1>
            <p className="text-xl md:text-2xl text-sky-100 max-w-2xl">
              Nơi hội tụ niềm đam mê và kiến thức về thế giới cá cảnh
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={[{ slug: "/ve-chung-toi", label: "Giới thiệu" }]} />

        {/* Giới thiệu Section */}
        <section className="max-w-5xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative w-full aspect-[1280/360]">
              <Image
                src="/images/banners/banner-2.png"
                alt="Ảnh giới thiệu Kinh Đô Cá Cảnh"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 1024px, 1280px"
                title="Ảnh giới thiệu Kinh Đô Cá Cảnh"
                priority
              />
            </div>
            <div className="p-8 md:p-10">
              <h2 className="text-3xl font-bold text-sky-700 mb-6">
                Về Kinh Đô Cá Cảnh
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 text-justify leading-relaxed">
                  Chào mừng bạn đến với{" "}
                  <strong className="text-sky-600">Kinh Đô Cá Cảnh</strong> –
                  điểm hẹn lý tưởng cho những người đam mê cá cảnh trên khắp
                  Việt Nam. Chúng tôi tự hào mang đến một thế giới đa dạng từ
                  các loài cá cảnh độc đáo, phụ kiện hồ cá chất lượng, đến thức
                  ăn chuyên dụng, thuốc đặc trị, cây thủy sinh phong phú, và kho
                  tàng kiến thức vô giá về nghệ thuật chăm sóc cá cảnh.
                </p>
                <p className="text-gray-600 text-justify leading-relaxed">
                  Với phương châm{" "}
                  <strong className="text-sky-600">
                    Uy tín – Chất lượng – Tận tâm
                  </strong>
                  , chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua
                  sắm tin cậy, tư vấn tận tình và dịch vụ hậu mãi chu đáo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Đội ngũ Section */}
        <section className="max-w-5xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="text-3xl font-bold text-sky-700 mb-6">
              Đội ngũ của chúng tôi
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 text-justify leading-relaxed">
                <strong className="text-sky-600">Kinh Đô Cá Cảnh</strong> được
                khởi nguồn và vận hành bởi một đội ngũ sinh viên trẻ đầy nhiệt
                huyết từ Trường Đại học Công nghệ Thông tin – Đại học Quốc gia
                TP.HCM. Với tình yêu mãnh liệt dành cho thế giới thủy sinh và
                khát khao ứng dụng công nghệ, chúng tôi hướng đến việc kiến tạo
                một hệ sinh thái cá cảnh trực tuyến hiện đại, tiện lợi và giàu
                tính kết nối cho cộng đồng người chơi cá trên cả nước.
              </p>
            </div>
          </div>
        </section>

        {/* Sản phẩm & Dịch vụ Grid */}
        <section className="max-w-5xl mx-auto mt-12">
          <h2 className="text-3xl font-bold text-sky-700 mb-8 text-center">
            Sản phẩm & Dịch vụ
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Cá cảnh */}

            <Link
              href="/san-pham?category=ca-canh&page=1"
              title="Cá cảnh"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🐠</span>
              </div>{" "}
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Cá cảnh
              </h3>
              <p className="text-gray-600 text-justify">
                Khám phá bộ sưu tập cá cảnh đa dạng và rực rỡ sắc màu của chúng
                tôi, từ cá Betta kiêu sa, cá Vàng phúc hậu đến cá Bảy Màu lấp
                lánh, cá Rồng uy nghi và nhiều chủng loại độc đáo khác.
              </p>
            </Link>

            {/* Thức ăn */}
            <Link
              href="/san-pham?category=thuc-an&page=1"
              title="Thức ăn cho cá"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🦐</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Thức ăn cho cá
              </h3>
              <p className="text-gray-600 text-justify">
                Cung cấp nguồn thức ăn chuyên biệt, giàu dinh dưỡng cho từng
                dòng cá, giúp cá cưng của bạn phát triển khỏe mạnh, lên màu tự
                nhiên và tràn đầy sức sống.
              </p>
            </Link>

            {/* Thuốc */}

            <Link
              href="/san-pham?category=thuoc&page=1"
              title="Thuốc cho cá"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Thuốc cho cá
              </h3>
              <p className="text-gray-600 text-justify">
                Đầy đủ các loại thuốc đặc trị hiệu quả, vitamin thiết yếu và
                khoáng chất cần thiết, bảo vệ sức khỏe toàn diện cho đàn cá của
                bạn.
              </p>
            </Link>
            {/* Phụ kiện */}

            <Link
              href="/san-pham?category=phu-kien&page=1"
              title="Phụ kiện bể cá"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Phụ kiện bể cá
              </h3>
              <p className="text-gray-600 text-justify">
                Trang bị trọn bộ phụ kiện hồ cá hiện đại: từ máy lọc, máy bơm,
                đèn chiếu sáng chuyên dụng đến các vật phẩm trang trí tinh tế,
                giúp bạn kiến tạo không gian thủy sinh hoàn hảo.
              </p>
            </Link>

            {/* Thực vật */}

            <Link
              href="/san-pham?category=phu-kien&page=1"
              title="Thực vật thủy sinh"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Thực vật thủy sinh
              </h3>
              <p className="text-gray-600 text-justify">
                Làm phong phú thêm thế giới nước của bạn với các loại cây thủy
                sinh đa dạng, không chỉ tăng tính thẩm mỹ mà còn tạo môi trường
                sống trong lành, tự nhiên cho cá.
              </p>
            </Link>

            {/* Bể cá */}

            <Link
              href="/san-pham?category=be-ca&page=1"
              title="Bể cá cảnh"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-sky-700 mb-3">
                Bể cá cảnh
              </h3>
              <p className="text-gray-600 text-justify">
                Tìm thấy chiếc bể cá ưng ý với nhiều lựa chọn về kích thước,
                kiểu dáng và chất liệu, phù hợp với mọi không gian và phong cách
                chơi cá của bạn.
              </p>
            </Link>
          </div>
        </section>

        {/* Kiến thức Section */}
        <section className="max-w-5xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="text-3xl font-bold text-sky-700 mb-6">
              Khám Phá Kho Tàng Kiến Thức Cá Cảnh
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-8 text-justify leading-relaxed">
                Tại <strong className="text-sky-600">Kinh Đô Cá Cảnh</strong>,
                chúng tôi không chỉ cung cấp sản phẩm mà còn đồng hành cùng bạn
                trên hành trình nuôi dưỡng đam mê. Hãy khám phá kho tàng kiến
                thức phong phú, được chắt lọc từ kinh nghiệm thực tế và các
                nguồn uy tín, giúp bạn tự tin chăm sóc thế giới thủy sinh của
                riêng mình:
              </p>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sky-500 text-2xl pt-1">📖</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Bí Kíp Chăm Sóc Chuyên Sâu
                      </h4>
                      <p className="text-gray-600 mt-0 text-justify">
                        Nắm vững trọn bộ bí kíp chăm sóc chi tiết cho từng loài
                        cá, từ điều kiện sống lý tưởng đến chế độ dinh dưỡng
                        khoa học, giúp cá cưng luôn khỏe mạnh và rạng rỡ.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sky-500 text-2xl pt-1">🔧</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Setup & Bảo Trì Bể Cá Đỉnh Cao
                      </h4>
                      <p className="text-gray-600 mt-0 text-justify">
                        Học cách thiết lập một bể cá hoàn chỉnh từ A-Z và các kỹ
                        thuật bảo trì chuyên nghiệp để duy trì môi trường nước
                        trong sạch, ổn định, tạo nên một hệ sinh thái thu nhỏ
                        tuyệt đẹp.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sky-500 text-2xl pt-1">💊</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Phòng & Trị Bệnh Hiệu Quả
                      </h4>
                      <p className="text-gray-600 mt-0 text-justify">
                        Trang bị kiến thức nhận biết sớm các dấu hiệu bệnh
                        thường gặp ở cá và các phương pháp phòng ngừa, điều trị
                        hiệu quả, giữ cho đàn cá của bạn luôn an toàn và khỏe
                        mạnh.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-sky-500 text-2xl pt-1">🐟</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Kỹ Thuật Nuôi Cá Sinh Sản
                      </h4>
                      <p className="text-gray-600 mt-0 text-justify">
                        Khám phá những bí quyết và kỹ thuật chuyên sâu để nuôi
                        cá sinh sản thành công, nhân giống những dòng cá yêu
                        thích và mở rộng cộng đồng thủy sinh của bạn.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sky-500 text-2xl pt-1">📰</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Tin Tức & Xu Hướng Ngành Cá
                      </h4>
                      <p className="text-gray-600 mt-0 text-justify">
                        Luôn cập nhật những thông tin mới nhất, các xu hướng
                        chơi cá độc đáo và những sự kiện nổi bật trong cộng đồng
                        yêu cá cảnh trong nước và quốc tế.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liên hệ Section */}
        <section className="max-w-5xl mx-auto mt-12 mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10">
                <h2 className="text-3xl font-bold text-sky-700 mb-4">
                  Kết Nối Với Kinh Đô Cá Cảnh
                </h2>
                <p className="text-gray-600 mb-8 text-justify leading-relaxed">
                  Chúng tôi luôn sẵn lòng lắng nghe và hỗ trợ bạn! Đừng ngần
                  ngại liên hệ với Kinh Đô Cá Cảnh qua các kênh dưới đây nếu bạn
                  có bất kỳ câu hỏi, góp ý hay cần tư vấn về thế giới cá cảnh.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Gửi Email cho chúng tôi
                      </p>
                      <a
                        href="mailto:kinhdocacanh@gmail.com"
                        className="text-gray-700 hover:text-sky-600 font-medium"
                        title="Email Kinh Đô Cá Cảnh"
                      >
                        kinhdocacanh@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hotline Tư Vấn</p>
                      <a
                        href="tel:0123456789"
                        className="text-gray-700 hover:text-sky-600 font-medium"
                        title="Hotline Kinh Đô Cá Cảnh"
                      >
                        0987 654 321  
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Facebook className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fanpage Facebook</p>
                      <a
                        href="https://www.facebook.com/profile.php?id=61576195002185"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-sky-600 font-medium"
                        title="Facebook Kinh Đô Cá Cảnh"
                      >
                        Kinh Đô Cá Cảnh
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0 pt-1">
                      <MapPin className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Địa chỉ của chúng tôi
                      </p>
                      <a href="https://maps.app.goo.gl/Ep9Sutyq3v5gyXus8" target="_blank" rel="noopener noreferrer" title="Địa chỉ của chúng tôi" className="text-gray-700 hover:text-sky-600 not-italic font-medium leading-relaxed">
                        Trường Đại học Công nghệ Thông tin – ĐHQG TP.HCM <br />
                        Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức, TP. Hồ
                        Chí Minh
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Cột nội dung/hình ảnh kêu gọi liên hệ bên phải */}
              <div className="hidden md:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600/50 to-sky-800/70 z-10"></div>
                <Image
                  src="/images/backgrounds/background-image-01.jpg" // Sử dụng lại banner-3 hoặc ảnh phù hợp hơn
                  alt="Kinh Đô Cá Cảnh - Sẵn sàng hỗ trợ"
                  fill
                  sizes="(min-width: 768px) 50vw, 0px"
                  className="object-cover object-center"
                  title="Kinh Đô Cá Cảnh - Kết nối để được tư vấn"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                    Luôn Sẵn Lòng Hỗ Trợ Bạn!
                  </h2>
                  <p className="text-white/90 text-center max-w-xs">
                    Có câu hỏi? Cần tư vấn về sản phẩm hay kỹ thuật nuôi cá? Đội ngũ Kinh Đô Cá Cảnh luôn ở đây để giúp bạn.
                  </p>
                  {/* Có thể thêm một nút nhỏ ở đây nếu muốn, ví dụ: "Gửi tin nhắn nhanh" trỏ đến Facebook Messenger hoặc Zalo */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
