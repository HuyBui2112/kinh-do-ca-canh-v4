"use client";

import { useState } from 'react';
import { apis } from '@/services/apis';
import {
  Order,
  OrderStatus,
  CreateOrderRequest,
  BuyNowOrderRequest,
  OrderApiResponse,
  OrderListApiResponse,
  CancelOrderApiResponse
} from '@/utils/types';
import { useToast } from '@/contexts/ToastContext';
import { useUser } from '@/contexts/UserContext'; // Để kiểm tra user và lấy token ngầm

interface UseOrdersReturn {
  // Trạng thái cho việc tạo đơn hàng
  isCreatingOrder: boolean;
  createOrderError: string | null;
  // Trạng thái cho việc lấy danh sách đơn hàng
  isLoadingOrders: boolean;
  loadOrdersError: string | null;
  // Trạng thái cho việc lấy chi tiết đơn hàng
  isLoadingOrderDetail: boolean;
  loadOrderDetailError: string | null;
  // Trạng thái cho việc hủy đơn hàng
  isCancellingOrder: boolean;
  cancelOrderError: string | null;

  // Hàm tạo đơn hàng
  placeOrder: (data: CreateOrderRequest) => Promise<Order | null>;
  // Hàm tạo đơn hàng mua ngay
  placeBuyNowOrder: (data: BuyNowOrderRequest) => Promise<Order | null>;
  // Hàm lấy danh sách đơn hàng của tôi
  fetchMyOrders: () => Promise<Order[] | null>;
  // Hàm lấy chi tiết đơn hàng
  fetchOrderDetails: (orderId: string) => Promise<Order | null>;
  // Hàm hủy đơn hàng
  requestCancelOrder: (orderId: string) => Promise<Order | null>;
}

export const useOrders = (): UseOrdersReturn => {
  const { showToast } = useToast();
  const { user } = useUser(); // Kiểm tra user để đảm bảo đã đăng nhập

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createOrderError, setCreateOrderError] = useState<string | null>(null);

  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [loadOrdersError, setLoadOrdersError] = useState<string | null>(null);

  const [isLoadingOrderDetail, setIsLoadingOrderDetail] = useState(false);
  const [loadOrderDetailError, setLoadOrderDetailError] = useState<string | null>(null);

  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [cancelOrderError, setCancelOrderError] = useState<string | null>(null);

  const placeOrder = async (data: CreateOrderRequest): Promise<Order | null> => {
    if (!user) {
      showToast('warning', 'Vui lòng đăng nhập để đặt hàng.');
      return null;
    }
    setIsCreatingOrder(true);
    setCreateOrderError(null);
    try {
      const response = await apis.createOrder(data);
      if (response.success && response.data) {
        showToast('success', response.message || 'Đặt hàng thành công!');
        // Có thể cần fetch lại cart ở đây nếu CartContext không tự động cập nhật sau khi đặt hàng
        return response.data;
      } else {
        setCreateOrderError(response.message || 'Không thể đặt hàng.');
        showToast('error', response.message || 'Không thể đặt hàng.');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi đặt hàng.';
      setCreateOrderError(errorMessage);
      showToast('error', errorMessage);
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const placeBuyNowOrder = async (data: BuyNowOrderRequest): Promise<Order | null> => {
    if (!user) {
      showToast('warning', 'Vui lòng đăng nhập để đặt hàng.');
      return null;
    }
    setIsCreatingOrder(true);
    setCreateOrderError(null);
    try {
      const response = await apis.createBuyNowOrder(data);
      if (response.success && response.data) {
        showToast('success', response.message || 'Đặt hàng thành công!');
        // Có thể cần fetch lại cart ở đây nếu CartContext không tự động cập nhật sau khi đặt hàng
        return response.data;
      } else {
        setCreateOrderError(response.message || 'Không thể đặt hàng.');
        showToast('error', response.message || 'Không thể đặt hàng.');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi đặt hàng.';
      setCreateOrderError(errorMessage);
      showToast('error', errorMessage);
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const fetchMyOrders = async (): Promise<Order[] | null> => {
    if (!user) {
      // showToast('warning', 'Vui lòng đăng nhập để xem đơn hàng.'); // Có thể không cần toast ở đây
      return null;
    }
    setIsLoadingOrders(true);
    setLoadOrdersError(null);
    try {
      const response = await apis.getMyOrders();
      if (response.success && response.data) {
        // showToast('success', response.message || 'Tải danh sách đơn hàng thành công.');
        return response.data;
      } else {
        setLoadOrdersError(response.message || 'Không thể tải danh sách đơn hàng.');
        showToast('error', response.message || 'Không thể tải danh sách đơn hàng.');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi tải danh sách đơn hàng.';
      setLoadOrdersError(errorMessage);
      showToast('error', errorMessage);
      return null;
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchOrderDetails = async (orderId: string): Promise<Order | null> => {
    if (!user) {
      // showToast('warning', 'Vui lòng đăng nhập để xem chi tiết đơn hàng.');
      return null;
    }
    setIsLoadingOrderDetail(true);
    setLoadOrderDetailError(null);
    try {
      const response = await apis.getOrderDetails(orderId);
      if (response.success && response.data) {
        return response.data;
      } else {
        setLoadOrderDetailError(response.message || 'Không thể tải chi tiết đơn hàng.');
        showToast('error', response.message || 'Không thể tải chi tiết đơn hàng.');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi tải chi tiết đơn hàng.';
      setLoadOrderDetailError(errorMessage);
      showToast('error', errorMessage);
      return null;
    } finally {
      setIsLoadingOrderDetail(false);
    }
  };

  const requestCancelOrder = async (orderId: string): Promise<Order | null> => {
    if (!user) {
      showToast('warning', 'Vui lòng đăng nhập để hủy đơn hàng.');
      return null;
    }
    
    // Kiểm tra trạng thái đơn hàng trước khi hủy
    const order = await fetchOrderDetails(orderId);
    if (!order) {
      showToast('error', 'Không tìm thấy đơn hàng để hủy.');
      return null;
    }
    
    // Chỉ cho phép hủy đơn hàng khi đơn hàng đang ở trạng thái "pending"
    if (order.status !== OrderStatus.PENDING) {
      showToast('error', 'Chỉ có thể hủy đơn hàng khi đơn hàng đang ở trạng thái chờ xử lý.');
      return null;
    }
    
    setIsCancellingOrder(true);
    setCancelOrderError(null);
    try {
      const response = await apis.cancelOrder(orderId);
      if (response.success && response.data) {
        showToast('success', response.message || 'Hủy đơn hàng thành công!');
        return response.data;
      } else {
        setCancelOrderError(response.message || 'Không thể hủy đơn hàng.');
        showToast('error', response.message || 'Không thể hủy đơn hàng.');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi khi hủy đơn hàng.';
      setCancelOrderError(errorMessage);
      showToast('error', errorMessage);
      return null;
    } finally {
      setIsCancellingOrder(false);
    }
  };

  return {
    isCreatingOrder,
    createOrderError,
    isLoadingOrders,
    loadOrdersError,
    isLoadingOrderDetail,
    loadOrderDetailError,
    isCancellingOrder,
    cancelOrderError,
    placeOrder,
    placeBuyNowOrder,
    fetchMyOrders,
    fetchOrderDetails,
    requestCancelOrder,
  };
}; 