"use client";

import React, { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderStatus } from "@/utils/types";
import { formatPrice } from "@/utils/formatters";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

interface OrderDetailProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderId, onClose }) => {
  const { fetchOrderDetails, requestCancelOrder, isLoadingOrderDetail } = useOrders();
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    const orderData = await fetchOrderDetails(orderId);
    if (orderData) {
      setOrder(orderData);
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!order) return;
    
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      setIsCancelling(true);
      const result = await requestCancelOrder(order._id);
      setIsCancelling(false);
      
      if (result) {
        setOrder({ ...order, status: OrderStatus.CANCELLED });
        showToast("success", "Hủy đơn hàng thành công!");
      }
    }
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
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.SHIPPING:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.PAID:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderContent = () => {
    if (isLoadingOrderDetail) {
      return (
        <motion.div
          className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </motion.div>
      );
    }

    if (!order) {
      return (
        <motion.div
          className="bg-white p-6 rounded-lg max-w-3xl w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="text-center py-10">
            <p className="text-red-600 mb-4">Không tìm thấy thông tin đơn hàng</p>
            <Button onClick={onClose}>Đóng</Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chi tiết đơn hàng</h2>
          <motion.button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>
        </div>

        {/* Order Summary */}
        <motion.div 
          className="bg-gray-50 p-4 rounded-lg mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-2">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-medium ml-2">{order._id}</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="ml-2">
                  {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="ml-2">
                  {order.paymentMethod || "Thanh toán khi nhận hàng (COD)"}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span className="text-gray-600">Trạng thái:</span>
                <span
                  className={`${getStatusColor(
                    order.status
                  )} px-2 py-1 rounded text-sm ml-2`}
                >
                  {translateOrderStatus(order.status)}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-bold ml-2">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div 
          className="border p-4 rounded-lg mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-medium mb-2">Thông tin giao hàng</h3>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <span className="text-gray-600">Người nhận:</span>
              <span className="ml-2">{order.shippingAddress.fullname}</span>
            </div>
            <div>
              <span className="text-gray-600">Số điện thoại:</span>
              <span className="ml-2">{order.shippingAddress.phone}</span>
            </div>
            <div>
              <span className="text-gray-600">Địa chỉ:</span>
              <span className="ml-2">{order.shippingAddress.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-medium mb-4">Sản phẩm đã đặt</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Sản phẩm</th>
                  <th className="py-3 px-4 text-right">Đơn giá</th>
                  <th className="py-3 px-4 text-right">Số lượng</th>
                  <th className="py-3 px-4 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item, index) => (
                  <motion.tr 
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="100%"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                              Không có ảnh
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/san-pham/${item.productId}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right font-medium">
                    Tổng cộng:
                  </td>
                  <td className="py-3 px-4 text-right font-bold">
                    {formatPrice(order.totalPrice)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={onClose} variant="outline">
            Đóng
          </Button>
          {order.status === OrderStatus.PENDING && (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
            </Button>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          // Đóng modal khi click bên ngoài
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetail; 