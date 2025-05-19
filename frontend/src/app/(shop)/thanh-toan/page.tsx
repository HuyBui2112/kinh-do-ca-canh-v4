"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useOrders } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CreditCard,
  DollarSign,
  CheckCircle,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { formatPrice } from "@/utils/formatters";
import { ShippingAddress } from "@/utils/types";
import { useToast } from "@/contexts/ToastContext";
import { apis } from "@/services/apis";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, itemCount, totalPrice, clearClientCart } = useCart();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const { placeOrder, placeBuyNowOrder, isCreatingOrder, createOrderError } =
    useOrders();
  const { showToast } = useToast();

  // State để lưu thông tin sản phẩm mua ngay (nếu có)
  const [buyNowProduct, setBuyNowProduct] = useState<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
    note: "",
  });

  // Form errors
  const [formErrors, setFormErrors] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "",
  });

  // Kiểm tra xem có phải là "mua ngay" không
  const isBuyNow = searchParams.has("buyNow");
  const productId = searchParams.get("productId");

  // Tải thông tin sản phẩm "mua ngay" nếu có
  useEffect(() => {
    // Nếu đã đặt hàng thành công, không cần tải sản phẩm nữa
    if (orderPlaced) return;

    const fetchBuyNowProduct = async () => {
      if (isBuyNow && productId) {
        try {
          // Tránh gọi API nhiều lần nếu đã có sản phẩm
          if (buyNowProduct && buyNowProduct.productId === productId) {
            setLoading(false);
            return;
          }

          const response = await apis.getProductDetail(productId);
          if (response.success && response.data) {
            const product = response.data;
            setBuyNowProduct({
              productId: product._id,
              name: product.pd_name,
              image:
                product.pd_image && product.pd_image.length > 0
                  ? product.pd_image[0].url
                  : "/images/placeholder-product.png",
              price: product.pd_price.sell_price,
              quantity: 1, // Mặc định mua 1 sản phẩm
            });
          } else {
            showToast("error", "Không thể tải thông tin sản phẩm");
            router.push("/san-pham");
          }
        } catch (error) {
          console.error("Lỗi khi tải sản phẩm:", error);
          showToast("error", "Có lỗi xảy ra khi tải thông tin sản phẩm");
          router.push("/san-pham");
        }
      }
      setLoading(false);
    };

    // Đặt loading=true trước khi gọi API
    setLoading(true);

    // Sử dụng biến để tránh memory leak
    let isActive = true;

    fetchBuyNowProduct().then(() => {
      // Nếu component đã unmount, không cập nhật state
      if (!isActive) return;
    });

    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [isBuyNow, productId, router, showToast, orderPlaced, buyNowProduct]);

  // Điền thông tin người dùng vào form khi đã có dữ liệu
  useEffect(() => {
    if (user && user.info_user) {
      // Lấy họ tên đầy đủ từ thông tin người dùng
      const fullName =
        `${user.info_user.username.firstname} ${user.info_user.username.lastname}`.trim();
      setFormData((prev) => ({
        ...prev,
        fullname: fullName,
        phone: user.info_user.phone || "",
        address: user.info_user.address || "",
      }));
    }
  }, [user]);

  // Kiểm tra người dùng đã đăng nhập và có sản phẩm để thanh toán không
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        router.push(
          "/dang-nhap?redirect=/thanh-toan" +
            (isBuyNow && productId ? `?buyNow=true&productId=${productId}` : "")
        );
      } else if (
        !loading &&
        !isBuyNow &&
        (!cart || !cart.items || cart.items.length === 0) &&
        !orderPlaced
      ) {
        // Chỉ chuyển hướng nếu không phải trạng thái đã đặt hàng thành công
        // Nếu không phải mua ngay và giỏ hàng trống
        showToast("warning", "Giỏ hàng của bạn đang trống");
        router.push("/gio-hang");
      }
    }
  }, [
    userLoading,
    isAuthenticated,
    router,
    cart,
    loading,
    isBuyNow,
    productId,
    showToast,
    orderPlaced,
  ]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const errors = {
      fullname: "",
      phone: "",
      address: "",
      city: "",
      paymentMethod: "",
    };

    if (!formData.fullname || formData.fullname.length < 2) {
      errors.fullname = "Họ tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    if (!formData.phone || !/^0\d{9}$/.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng số 0)";
      isValid = false;
    }

    if (!formData.address || formData.address.length < 5) {
      errors.address = "Địa chỉ phải có ít nhất 5 ký tự";
      isValid = false;
    }

    if (!formData.city) {
      errors.city = "Vui lòng chọn tỉnh/thành phố";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Xử lý khi submit form thanh toán
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated) {
      showToast("warning", "Vui lòng đăng nhập để thanh toán");
      return;
    }

    // Tạo object địa chỉ giao hàng
    const shippingAddress: ShippingAddress = {
      fullname: formData.fullname,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
    };

    try {
      let order = null;

      if (isBuyNow && productId && buyNowProduct) {
        // Nếu là Mua ngay, sử dụng API mua ngay
        const buyNowRequest = {
          shippingAddress,
          paymentMethod: formData.paymentMethod,
          productId: productId,
          quantity: buyNowProduct.quantity,
        };

        order = await placeBuyNowOrder(buyNowRequest);
      } else {
        // Nếu thanh toán từ giỏ hàng, sử dụng API tạo đơn hàng thường
        const orderRequest = {
          shippingAddress,
          paymentMethod: formData.paymentMethod,
        };

        order = await placeOrder(orderRequest);
      }

      if (order) {
        // Đánh dấu là đã đặt hàng thành công trước khi thực hiện các hành động khác
        setOrderPlaced(true);
        setOrderId(order._id);

        // Xóa giỏ hàng sau khi đặt hàng thành công (nếu không phải mua ngay)
        // và chỉ khi chưa đánh dấu orderPlaced = true
        if (!isBuyNow) {
          // Đánh dấu là đã thanh toán (để tránh re-render)
          await clearClientCart();
        }

        showToast("success", "Đặt hàng thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      showToast("error", "Có lỗi xảy ra khi đặt hàng");
    }
  };

  // Tính tổng tiền cho sản phẩm mua ngay (nếu có)
  const buyNowTotalPrice = buyNowProduct
    ? buyNowProduct.price * buyNowProduct.quantity
    : 0;

  // Hiển thị màn hình loading
  if (userLoading || loading) {
    return (
      <div className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
        <p className="mt-4 text-lg text-gray-700">Đang tải thông tin...</p>
      </div>
    );
  }

  // Hiển thị màn hình xác nhận đơn hàng thành công
  if (orderPlaced && orderId) {
    return (
      <div className="container mx-auto p-4 min-h-[calc(100vh-200px)]">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được tiếp nhận và đang
            được xử lý.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700">
              Mã đơn hàng: <span className="font-semibold">{orderId}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/ca-nhan`}>
              <Button variant="outline" className="w-full sm:w-auto">
                Xem chi tiết đơn hàng
              </Button>
            </Link>
            <Link href="/san-pham">
              <Button className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumbs items={[{ slug: "/thanh-toan", label: "Cá nhân" }]} />
        <h1 className="text-2xl md:text-3xl font-bold text-sky-600 mt-4 mb-2 lg:mb-4">
          Thanh toán
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form thông tin giao hàng & thanh toán */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="border-b border-sky-900/30 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Thông tin giao hàng
                </h2>
                <p className="text-gray-600 text-sm">
                  Nhập thông tin giao hàng chính xác để đảm bảo bạn nhận được
                  hàng
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ tên */}
                  <div className="space-y-2">
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500 ${
                        formErrors.fullname
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nguyễn Văn A"
                    />
                    {formErrors.fullname && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fullname}
                      </p>
                    )}
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500 ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0912345678"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500 ${
                      formErrors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                {/* Tỉnh/Thành phố */}
                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500 ${
                      formErrors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Khác">Tỉnh/Thành phố khác</option>
                  </select>
                  {formErrors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                {/* Ghi chú */}
                <div className="space-y-2">
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ghi chú đơn hàng (tùy chọn)
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 min-h-[100px]"
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian nhận hàng hoặc địa điểm giao hàng chi tiết hơn."
                  />
                </div>

                {/* Phương thức thanh toán */}
                <div className="pb-4 border-b border-sky-900/30">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Phương thức thanh toán
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 border border-sky-900/30 p-4 rounded-md cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === "COD"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-sky-600"
                      />
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 border border-sky-900/30 p-4 rounded-md cursor-not-allowed opacity-60">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="OnlineBanking"
                        disabled
                        className="h-4 w-4 text-sky-600"
                      />
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                        <span>Thanh toán Online (Đang phát triển)</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between mt-6">
                  <Link
                    href={isBuyNow ? `/san-pham/${productId}` : "/gio-hang"}
                  >
                    <button
                      type="button"
                      className="w-full md:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center justify-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </button>
                  </Link>

                  <button
                    type="submit"
                    disabled={isCreatingOrder}
                    className="w-full md:w-auto px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md flex items-center justify-center"
                  >
                    {isCreatingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Hoàn tất đặt hàng
                      </>
                    )}
                  </button>
                </div>

                {createOrderError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {createOrderError}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Tổng quan đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="border-b border-sky-900/30 pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Đơn hàng của bạn
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isBuyNow
                    ? "1 sản phẩm"
                    : `${itemCount} sản phẩm trong giỏ hàng`}
                </p>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 mb-4">
                {isBuyNow && buyNowProduct ? (
                  // Hiển thị sản phẩm mua ngay
                  <div className="flex items-center space-x-4 py-3 border-b border-sky-900/30">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={
                          buyNowProduct.image ||
                          "/images/placeholder-product.png"
                        }
                        alt={buyNowProduct.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {buyNowProduct.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        SL: {buyNowProduct.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-sky-600">
                      {formatPrice(buyNowProduct.price)}
                    </div>
                  </div>
                ) : (
                  // Hiển thị sản phẩm từ giỏ hàng
                  <>
                    {cart?.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center space-x-4 py-3 border-b border-sky-900/30"
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={
                              item.image || "/images/placeholder-product.png"
                            }
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            SL: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-sky-600">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Tóm tắt thanh toán */}
              <div className="border-t border-sky-900/30 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {formatPrice(isBuyNow ? buyNowTotalPrice : totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">
                    {formatPrice(0)} {/* Miễn phí vận chuyển */}
                  </span>
                </div>
                <div className="flex justify-between border-t border-sky-900/30 pt-3">
                  <span className="text-lg font-semibold">Tổng cộng:</span>
                  <span className="text-lg font-bold text-sky-600">
                    {formatPrice(isBuyNow ? buyNowTotalPrice : totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
