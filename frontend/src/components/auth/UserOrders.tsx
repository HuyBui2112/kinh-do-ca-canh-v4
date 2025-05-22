"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useOrders } from "@/hooks/useOrders";
import { formatPrice } from "@/utils/formatters";
import { Order, OrderStatus } from "@/utils/types";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";
import Image from "next/image";
import OrderDetail from "./OrderDetail";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";

enum SortOrder {
  DESC = "desc",
  ASC = "asc",
}

type FilterType =
  | "all"
  | "paid"
  | "unpaid"
  | "pending"
  | "shipping"
  | "delivered"
  | "cancelled";

const UserOrders: React.FC = () => {
  const { fetchMyOrders, requestCancelOrder, isLoadingOrders } = useOrders();
  const { showToast, confirmAction } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [isLoadingMyOrders, setIsLoadingMyOrders] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Hàm lấy danh sách đơn hàng
  const loadOrders = useCallback(async () => {
    if (isLoadingMyOrders || dataLoaded) return; // Tránh tải lại nhiều lần
    
    setIsLoadingMyOrders(true);
    try {
      const ordersData = await fetchMyOrders();
      if (ordersData) {
        setOrders(ordersData);
        setDataLoaded(true); // Đánh dấu đã tải xong
      }
    } finally {
      setIsLoadingMyOrders(false);
    }
  }, [fetchMyOrders, isLoadingMyOrders, dataLoaded]);

  // Lấy danh sách đơn hàng khi component mount
  useEffect(() => {
    if (!dataLoaded) {
      loadOrders();
    }
  }, [loadOrders, dataLoaded]);

  // Hàm lọc và sắp xếp đơn hàng
  const filterAndSortOrders = useCallback(() => {
    let result = [...orders];

    // Lọc theo trạng thái
    if (activeFilter !== "all") {
      if (activeFilter === "paid") {
        result = result.filter((order) => order.status === OrderStatus.PAID);
      } else if (activeFilter === "unpaid") {
        result = result.filter((order) => order.status !== OrderStatus.PAID);
      } else {
        // Lọc theo OrderStatus (pending, shipping, delivered, cancelled)
        result = result.filter((order) => order.status === activeFilter);
      }
    }

    // Sắp xếp theo thời gian đặt hàng
    result.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortOrder === SortOrder.DESC ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(result);
  }, [orders, sortOrder, activeFilter]);

  // Lọc và sắp xếp đơn hàng khi orders, sortOrder hoặc activeFilter thay đổi
  useEffect(() => {
    if (orders.length > 0) {
      filterAndSortOrders();
    }
  }, [filterAndSortOrders, orders.length, activeFilter, sortOrder]);

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId: string) => {
    confirmAction(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      async () => {
        setCancellingOrderId(orderId);
        const result = await requestCancelOrder(orderId);
        if (result) {
          // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === orderId
                ? { ...order, status: OrderStatus.CANCELLED }
                : order
            )
          );
          showToast("success", "Hủy đơn hàng thành công!");
        }
        setCancellingOrderId(null);
      },
      {
        type: "warning",
        confirmLabel: "Xác nhận hủy",
        cancelLabel: "Giữ lại"
      }
    );
  };

  // Hàm xem chi tiết đơn hàng
  const handleViewOrder = (orderId: string) => {
    setViewOrderId(orderId);
  };

  // Hàm đóng modal xem chi tiết
  const handleCloseDetail = () => {
    setViewOrderId(null);
  };

  // Hàm chuyển đổi OrderStatus sang tiếng Việt để hiển thị
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

  // Hàm lấy màu sắc tương ứng với trạng thái đơn hàng
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

  // Render danh sách bộ lọc
  const renderFilters = () => {
    const filters: { label: string; value: FilterType }[] = [
      { label: "Tất cả", value: "all" },
      { label: "Chờ xác nhận", value: "pending" },
      { label: "Đang giao", value: "shipping" },
      { label: "Đã giao", value: "delivered" },
      { label: "Đã thanh toán", value: "paid" },
      { label: "Chưa thanh toán", value: "unpaid" },
      { label: "Đã hủy", value: "cancelled" },
    ];

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <motion.button
            key={filter.value}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors font-medium ${
              activeFilter === filter.value
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveFilter(filter.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>
    );
  };

  if (isLoadingOrders) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-solid border-sky-600 border-r-transparent mb-4"></div>
        <p className="text-sky-800 font-medium">
          Đang tải danh sách đơn hàng...
        </p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150 } },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sky-900/20">
      <AnimatePresence>
        {viewOrderId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sky-900/60 backdrop-blur-sm z-50 flex justify-center items-center overflow-auto"
          >
            <OrderDetail orderId={viewOrderId} onClose={handleCloseDetail} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="px-5 py-4 border-b border-sky-900/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-medium text-sky-900">Đơn hàng của tôi</h2>
      </motion.div>

      <div className="p-5">
        {/* Phần lọc và sắp xếp */}
        <motion.div
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 bg-sky-50/50 p-4 rounded-lg border border-sky-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {renderFilters()}
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-sm font-medium text-sky-800">Sắp xếp:</span>
            <motion.select
              className="border rounded-md px-3 py-1.5 text-sm bg-white"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <option value={SortOrder.DESC}>Mới nhất</option>
              <option value={SortOrder.ASC}>Cũ nhất</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Danh sách đơn hàng */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div
              className="text-center py-12 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="empty"
            >
              <div className="bg-sky-50/50 rounded-xl p-8 border border-sky-100">
                <div className="text-sky-500 mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-sky-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Không có đơn hàng nào
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeFilter !== "all"
                    ? "Không tìm thấy đơn hàng phù hợp với bộ lọc"
                    : "Bạn chưa có đơn hàng nào"}
                </p>
                <Link
                  href="/san-pham"
                  className="inline-block px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              animate="show"
              key="order-list"
            >
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 border-sky-100"
                  variants={item}
                  layout
                >
                  {/* Header của đơn hàng */}
                  <div className="bg-gradient-to-r from-sky-50 to-sky-100 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-sky-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          Mã đơn:{" "}
                          <span className="text-sky-800">{order._id}</span>
                        </span>
                        <motion.span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                            order.status
                          )}`}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 * index }}
                        >
                          {translateOrderStatus(order.status)}
                        </motion.span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Ngày đặt:{" "}
                        {new Date(order.orderDate).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="font-medium text-sky-800">
                        Tổng tiền: {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Sản phẩm trong đơn hàng - Hiển thị tối đa 2 sản phẩm */}
                  <motion.div
                    className="p-4 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center space-x-4 border-b pb-3 last:border-0 border-sky-900/30 last:pb-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-sky-100">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="100%"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
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
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/san-pham/${item.productId}`}
                              className="text-sm font-medium hover:text-sky-600 transition-colors text-gray-800"
                            >
                              {item.name}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatPrice(item.price)} x {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sky-700">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-500 text-center pt-2 italic">
                          ... và {order.items.length - 2} sản phẩm khác
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Footer của đơn hàng */}
                  <div className="px-4 py-3 bg-gradient-to-r from-sky-50 to-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-sky-100">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-1">
                          Người nhận:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.shippingAddress.fullname}
                        </span>
                      </div>
                      <div className="truncate max-w-xs flex items-start mt-1">
                        <span className="font-medium text-gray-700 mr-1">
                          Địa chỉ:
                        </span>{" "}
                        <span className="text-gray-900">
                          {order.shippingAddress.address}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleViewOrder(order._id)}
                          className="transition-all duration-200 border-sky-600 text-sky-600 hover:bg-sky-50"
                        >
                          Xem chi tiết
                        </Button>
                      </motion.div>
                      {order.status === OrderStatus.PENDING && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                          >
                            {cancellingOrderId === order._id
                              ? "Đang hủy..."
                              : "Hủy đơn"}
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserOrders;
