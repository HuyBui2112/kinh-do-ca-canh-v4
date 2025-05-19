"use client";

import React, { useEffect, useState } from "react";
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

type FilterType = "all" | "paid" | "unpaid" | "pending" | "shipping" | "delivered" | "cancelled";

const UserOrders: React.FC = () => {
  const { fetchMyOrders, requestCancelOrder, isLoadingOrders } = useOrders();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  // Lấy danh sách đơn hàng khi component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Lọc và sắp xếp đơn hàng khi orders, sortOrder hoặc activeFilter thay đổi
  useEffect(() => {
    filterAndSortOrders();
  }, [orders, sortOrder, activeFilter]);

  // Hàm lấy danh sách đơn hàng
  const loadOrders = async () => {
    const ordersData = await fetchMyOrders();
    if (ordersData) {
      setOrders(ordersData);
    }
  };

  // Hàm lọc và sắp xếp đơn hàng
  const filterAndSortOrders = () => {
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
  };

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      setCancellingOrderId(orderId);
      const result = await requestCancelOrder(orderId);
      if (result) {
        // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: OrderStatus.CANCELLED } : order
          )
        );
        showToast("success", "Hủy đơn hàng thành công!");
      }
      setCancellingOrderId(null);
    }
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
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeFilter === filter.value
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
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

  // Render sắp xếp
  const renderSortOptions = () => {
    return (
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Sắp xếp:</span>
        <motion.select
          className="border rounded px-2 py-1 text-sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <option value={SortOrder.DESC}>Mới nhất</option>
          <option value={SortOrder.ASC}>Cũ nhất</option>
        </motion.select>
      </div>
    );
  };

  if (isLoadingOrders) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent mb-4"></div>
        <p>Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150 } }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <AnimatePresence>
        {viewOrderId && (
          <OrderDetail orderId={viewOrderId} onClose={handleCloseDetail} />
        )}
      </AnimatePresence>
      
      <motion.div
        className="px-5 py-4 border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-medium">Đơn hàng của tôi</h2>
      </motion.div>
      
      <div className="p-5">
        {/* Phần lọc và sắp xếp */}
        <motion.div 
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {renderFilters()}
          {renderSortOptions()}
        </motion.div>

        {/* Danh sách đơn hàng */}
        <AnimatePresence mode="wait">
          {filteredOrders.length === 0 ? (
            <motion.div 
              className="text-center py-10 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="empty"
            >
              Không có đơn hàng nào {activeFilter !== "all" ? "phù hợp với bộ lọc" : ""}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
              key="order-list"
            >
              {filteredOrders.map((order, index) => (
                <motion.div 
                  key={order._id} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                  variants={item}
                  layout
                >
                  {/* Header của đơn hàng */}
                  <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Mã đơn: {order._id}</span>
                        <motion.span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 * index }}
                        >
                          {translateOrderStatus(order.status)}
                        </motion.span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Ngày đặt: {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="font-medium">
                        Tổng tiền: {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Sản phẩm trong đơn hàng - Hiển thị tối đa 2 sản phẩm */}
                  <motion.div
                    className="p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center space-x-4 border-b pb-3 last:border-0 last:pb-0"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border">
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
                                Không có ảnh
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/san-pham/${item.productId}`}
                              className="text-sm font-medium hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            <div className="text-sm text-gray-500">
                              {formatPrice(item.price)} x {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-500 text-center pt-2">
                          ... và {order.items.length - 2} sản phẩm khác
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Footer của đơn hàng */}
                  <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="text-sm">
                      <div>
                        <span className="font-medium">Người nhận:</span>{" "}
                        {order.shippingAddress.fullname}
                      </div>
                      <div className="truncate max-w-xs">
                        <span className="font-medium">Địa chỉ:</span>{" "}
                        {order.shippingAddress.address}
                      </div>
                    </div>
                    <div className="flex gap-2 self-end sm:self-auto">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline"
                          onClick={() => handleViewOrder(order._id)}
                          className="transition-all duration-200"
                        >
                          Xem chi tiết
                        </Button>
                      </motion.div>
                      {order.status === OrderStatus.PENDING && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                          >
                            {cancellingOrderId === order._id ? "Đang hủy..." : "Hủy đơn"}
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