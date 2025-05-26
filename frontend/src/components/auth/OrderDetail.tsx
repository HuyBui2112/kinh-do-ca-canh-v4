"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/utils/types";
import { formatPrice } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import {
  X,
  Truck,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface OrderDetailProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onClose }) => {
  const { fetchOrderDetails, requestCancelOrder, isLoadingOrderDetail } =
    useOrders();
  const { showToast, confirmAction } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isLoadingOrderData, setIsLoadingOrderData] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadOrder = useCallback(async () => {
    if (isLoadingOrderData || dataLoaded) return;

    setIsLoadingOrderData(true);
    try {
      const orderData = await fetchOrderDetails(orderId);
      if (orderData) {
        setOrder(orderData);
        setDataLoaded(true);
      }
    } finally {
      setIsLoadingOrderData(false);
    }
  }, [fetchOrderDetails, orderId, isLoadingOrderData, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) {
      loadOrder();
    }
  }, [loadOrder, dataLoaded]);

  // Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!order) return;

    // Sử dụng confirmAction để xác nhận thay vì window.confirm
    confirmAction(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      async () => {
        setIsCancelling(true);
        try {
          const result = await requestCancelOrder(order._id);

          if (result) {
            setOrder({ ...order, status: OrderStatus.CANCELLED });
            showToast("success", "Hủy đơn hàng thành công!");
          }
        } finally {
          setIsCancelling(false);
        }
      },
      {
        type: "warning",
        confirmLabel: "Xác nhận hủy",
        cancelLabel: "Giữ lại",
      }
    );
  };

  // Chuyển đổi trạng thái sang tiếng Việt
  const translateOrderStatus = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "Chờ xác nhận";
      case OrderStatus.SHIPPING:
        return "Đang giao hàng";
      case OrderStatus.DELIVERED:
        return "Đã giao thành công";
      case OrderStatus.PAID:
        return "Đã thanh toán";
      case OrderStatus.CANCELLED:
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Mã màu cho từng trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case OrderStatus.SHIPPING:
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800 border border-green-200";
      case OrderStatus.PAID:
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Biểu tượng cho trạng thái
  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.SHIPPING:
        return <Truck size={16} className="mr-1" />;
      case OrderStatus.DELIVERED:
        return <ShoppingBag size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (isLoadingOrderData || (isLoadingOrderDetail && !order)) {
      return (
        <div className="bg-white p-8 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-sky-900/20">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-sky-600 border-r-transparent mb-6"></div>
            <p className="text-sky-800 font-medium">
              Đang tải thông tin đơn hàng...
            </p>
          </div>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="bg-white p-8 rounded-xl max-w-3xl w-full shadow-2xl border border-sky-900/20">
          <div className="text-center py-10">
            <div className="bg-red-50 rounded-full p-6 inline-flex items-center justify-center mb-6">
              <X size={32} className="text-rose-500" />
            </div>
            <p className="text-rose-600 text-lg font-medium mb-4">
              Không tìm thấy thông tin đơn hàng
            </p>
            <Button onClick={onClose} className="bg-sky-600 hover:bg-sky-700">
              Đóng
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative max-w-4xl w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-sky-900/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingBag size={20} className="mr-2" />
            Chi tiết đơn hàng
          </h2>
          <button
            className="text-white hover:text-white/80 p-1 rounded-full bg-white/20 backdrop-blur-sm"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-sky-50/50 p-5 rounded-xl mb-6 border border-sky-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <ShoppingBag size={14} />
                  </div>
                  <div>
                    <span className="text-gray-600 block text-sm">
                      Mã đơn hàng:
                    </span>
                    <span className="font-medium text-sky-700">
                      {order._id}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <span className="text-gray-600 block text-sm">
                      Ngày đặt:
                    </span>
                    <span className="text-gray-800">
                      {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <span className="text-gray-600 block text-sm">
                      Phương thức thanh toán:
                    </span>
                    <span className="text-gray-800">
                      {order.paymentMethod || "Thanh toán khi nhận hàng (COD)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 md:border-l md:border-sky-100 md:pl-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <Truck size={14} />
                  </div>
                  <div>
                    <span className="text-gray-600 block text-sm">
                      Trạng thái:
                    </span>
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} px-3 py-1 rounded-full text-sm flex items-center mt-1 font-medium`}
                    >
                      {getStatusIcon(order.status)}
                      {translateOrderStatus(order.status)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <ShoppingBag size={14} />
                  </div>
                  <div>
                    <span className="text-gray-600 block text-sm">
                      Tổng tiền:
                    </span>
                    <span className="font-bold text-lg text-sky-700">
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-5 rounded-xl mb-6 border border-sky-100 shadow-sm">
            <h3 className="font-medium mb-4 text-sky-900 flex items-center">
              <MapPin size={18} className="mr-2 text-sky-600" />
              Thông tin giao hàng
            </h3>

            <div className="grid grid-cols-1 gap-3 pl-2">
              <div className="flex items-start">
                <User
                  size={16}
                  className="mr-2 text-sky-600 mt-1 flex-shrink-0"
                />
                <div>
                  <span className="text-gray-600 text-sm">Người nhận:</span>
                  <span className="ml-1 font-medium text-gray-800">
                    {order.shippingAddress.fullname}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <Phone
                  size={16}
                  className="mr-2 text-sky-600 mt-1 flex-shrink-0"
                />
                <div>
                  <span className="text-gray-600 text-sm">Số điện thoại:</span>
                  <span className="ml-1 font-medium text-gray-800">
                    {order.shippingAddress.phone}
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin
                  size={16}
                  className="mr-2 text-sky-600 mt-1 flex-shrink-0"
                />
                <div>
                  <span className="text-gray-600 text-sm">Địa chỉ:</span>
                  <span className="ml-1 font-medium text-gray-800">
                    {order.shippingAddress.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-4 text-sky-900 flex items-center">
              <ShoppingBag size={18} className="mr-2 text-sky-600" />
              Sản phẩm đã đặt
            </h3>

            <div className="border border-sky-100 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-sky-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sky-800 font-medium">
                        Sản phẩm
                      </th>
                      <th className="py-3 px-4 text-right text-sky-800 font-medium">
                        Đơn giá
                      </th>
                      <th className="py-3 px-4 text-right text-sky-800 font-medium">
                        Số lượng
                      </th>
                      <th className="py-3 px-4 text-right text-sky-800 font-medium">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {order.items.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-sky-50/70 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border border-sky-100">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  title={item.name}
                                  sizes="100%"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="3"
                                      y="3"
                                      width="18"
                                      height="18"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/san-pham/${item.productId}`}
                                title={item.name}
                                className="text-sky-700 hover:text-sky-600 transition-colors font-medium"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatPrice(item.price)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          <span className="bg-sky-50 px-2 py-0.5 rounded font-medium">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-sky-700">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-sky-50/80">
                    <tr>
                      <td
                        colSpan={3}
                        className="py-3 px-4 text-right font-medium text-sky-900"
                      >
                        Tổng cộng:
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-lg text-sky-700">
                        {formatPrice(order.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-sky-100">
            <div>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-sky-200 hover:bg-sky-50 text-sky-700"
              >
                Đóng
              </Button>
            </div>

            {order.status === OrderStatus.PENDING && (
              <div>
                <Button
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-sky-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        // Đóng modal khi click bên ngoài
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {renderContent()}
    </div>
  );
};

export default OrderDetail;
