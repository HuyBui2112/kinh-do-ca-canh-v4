"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { apis } from "@/services/apis";
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  UpdateCartRequest,
  // CartApiResponse
} from "@/utils/types";
import { useToast } from "./ToastContext";
import { useUser } from "./UserContext"; // Để kiểm tra người dùng đã đăng nhập chưa

interface ErrorWithMessage {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number; // Tổng số lượng các sản phẩm trong giỏ
  totalPrice: number; // Tổng giá trị giỏ hàng
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<boolean>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  clearClientCart: () => Promise<boolean>; // Đổi tên từ clearCart để tránh trùng với API
  updateCart: (
    items: { productId: string; quantity: number }[]
  ) => Promise<boolean>; // Thêm phương thức cập nhật toàn bộ giỏ hàng
  isProductInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { user } = useUser(); // Lấy thông tin người dùng

  const calculateTotals = useCallback((items: CartItem[]) => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { itemCount, totalPrice };
  }, []);

  const [itemCount, setItemCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    if (cart && cart.items) {
      const { itemCount: newCount, totalPrice: newPrice } = calculateTotals(
        cart.items
      );
      setItemCount(newCount);
      setTotalPrice(newPrice);
    } else {
      setItemCount(0);
      setTotalPrice(0);
    }
  }, [cart, calculateTotals]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      // Chỉ fetch cart nếu người dùng đã đăng nhập
      setCart(null); // Xóa giỏ hàng local nếu người dùng logout
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apis.getCart();
      if (response.success && response.data) {
        setCart(response.data);
      } else {
        // Backend sẽ tự tạo giỏ hàng rỗng nếu chưa có, nên lỗi ở đây có thể là lỗi mạng hoặc server
        setError(response.message || "Không thể tải giỏ hàng.");
        showToast("error", response.message || "Không thể tải giỏ hàng.");
        setCart(null); // Đảm bảo cart là null nếu có lỗi
      }
    } catch (err: unknown) {
      let errorMessage = "Lỗi không xác định khi tải giỏ hàng.";
      if (typeof err === "object" && err !== null) {
        const e = err as ErrorWithMessage;
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      showToast("error", errorMessage);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [showToast, user]);

  // Tải giỏ hàng khi người dùng thay đổi (login/logout)
  useEffect(() => {
    // Thêm biến để kiểm soát việc gọi API
    let isActive = true;

    if (user) {
      fetchCart().then(() => {
        // Chỉ cập nhật state nếu component vẫn mounted
        if (!isActive) return;
      });
    }

    // Cleanup function để tránh memory leak và gọi API không cần thiết
    return () => {
      isActive = false;
    };
  }, [fetchCart, user]);

  const addToCart = async (
    productId: string,
    quantity: number
  ): Promise<boolean> => {
    if (!user) {
      showToast("warning", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return false;
    }
    setLoading(true);
    const requestData: AddToCartRequest = { productId, quantity };
    try {
      const response = await apis.addItemToCart(requestData);
      if (response.success && response.data) {
        setCart(response.data);
        showToast("success", response.message || "Đã thêm vào giỏ hàng!");
        return true;
      } else {
        setError(response.message || "Không thể thêm vào giỏ hàng.");
        showToast("error", response.message || "Không thể thêm vào giỏ hàng.");
        return false;
      }
    } catch (err: unknown) {
      let errorMessage = "Lỗi khi thêm vào giỏ hàng.";
      if (typeof err === "object" && err !== null) {
        const e = err as ErrorWithMessage;
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      showToast("error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (
    productId: string,
    quantity: number
  ): Promise<boolean> => {
    if (!user) {
      showToast("warning", "Vui lòng đăng nhập để cập nhật giỏ hàng.");
      return false;
    }

    // Nếu quantity = 0, gọi removeFromCart thay vì cập nhật
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    setLoading(true);
    const requestData: UpdateCartItemRequest = { quantity };
    try {
      const response = await apis.updateCartItem(productId, requestData);
      if (response.success && response.data) {
        setCart(response.data);
        showToast(
          "success",
          response.message || "Cập nhật giỏ hàng thành công!"
        );
        return true;
      } else {
        setError(response.message || "Không thể cập nhật giỏ hàng.");
        showToast("error", response.message || "Không thể cập nhật giỏ hàng.");
        return false;
      }
    } catch (err: unknown) {
      let errorMessage = "Lỗi khi cập nhật giỏ hàng.";
      if (typeof err === "object" && err !== null) {
        const e = err as ErrorWithMessage;
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      showToast("error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (
    items: { productId: string; quantity: number }[]
  ): Promise<boolean> => {
    if (!user) {
      showToast("warning", "Vui lòng đăng nhập để cập nhật giỏ hàng.");
      return false;
    }
    setLoading(true);

    // Tách các sản phẩm cần xóa (quantity <= 0) và cần cập nhật (quantity > 0)
    const itemsToUpdate = items.filter((item) => item.quantity > 0);
    const itemsToRemove = items.filter((item) => item.quantity <= 0);

    try {
      // Xử lý các sản phẩm cần xóa trước (nếu có) - cách này có thể gây ra nhiều API calls
      if (itemsToRemove.length > 0) {
        for (const item of itemsToRemove) {
          // Không quan tâm kết quả trả về - chỉ log lỗi nếu có
          try {
            await apis.removeCartItem(item.productId);
          } catch (err) {
            console.error(`Lỗi khi xóa sản phẩm ${item.productId}:`, err);
          }
        }
      }

      // Cập nhật các sản phẩm còn lại (nếu có)
      if (itemsToUpdate.length > 0) {
        const requestData: UpdateCartRequest = { items: itemsToUpdate };
        const response = await apis.updateCart(requestData);
        if (response.success && response.data) {
          setCart(response.data);
          showToast(
            "success",
            response.message || "Cập nhật giỏ hàng thành công!"
          );
          return true;
        } else {
          setError(response.message || "Không thể cập nhật giỏ hàng.");
          showToast(
            "error",
            response.message || "Không thể cập nhật giỏ hàng."
          );
          return false;
        }
      } else {
        // Nếu tất cả đều là items cần xóa và đã xóa xong, tải lại giỏ hàng
        await fetchCart();
        showToast("success", "Đã xóa các sản phẩm khỏi giỏ hàng!");
        return true;
      }
    } catch (err: unknown) {
      let errorMessage = "Lỗi khi tải cập nhật giỏ hàng.";
      if (typeof err === "object" && err !== null) {
        const e = err as ErrorWithMessage;
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      showToast("error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!user) {
      showToast("warning", "Vui lòng đăng nhập để xóa sản phẩm.");
      return false;
    }
    setLoading(true);
    try {
      const response = await apis.removeCartItem(productId);
      if (response.success && response.data) {
        setCart(response.data);
        showToast(
          "success",
          response.message || "Đã xóa sản phẩm khỏi giỏ hàng!"
        );
        return true;
      } else {
        setError(response.message || "Không thể xóa sản phẩm.");
        showToast("error", response.message || "Không thể xóa sản phẩm.");
        return false;
      }
    } catch (err: unknown) {
      let errorMessage = "Lỗi khi xóa giỏ hàng.";
      if (typeof err === "object" && err !== null) {
        const e = err as ErrorWithMessage;
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      showToast("error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearClientCart = async (): Promise<boolean> => {
    if (!user) {
      showToast("warning", "Vui lòng đăng nhập để làm trống giỏ hàng.");
      return false;
    }
    setLoading(true);
    try {
      const response = await apis.clearCart(); // response.data bây giờ là Cart | null
      if (response.success && response.data) {
        setCart(response.data); // response.data là Cart object với items đã được làm trống
        showToast("success", response.message || "Đã làm trống giỏ hàng!");
        return true;
      } else if (response.success && !response.data) {
        // Trường hợp hiếm: success true nhưng data là null. Tạo cart rỗng phía client.
        // Điều này không nên xảy ra nếu backend trả về đúng đối tượng cart đã clear.
        setCart({
          _id: cart?._id || Date.now().toString(),
          userId: user._id,
          items: [],
          totalPrice: 0, // Thêm trường totalPrice để đúng với interface Cart
        });
        showToast(
          "success",
          response.message || "Giỏ hàng đã được làm trống (phía client)."
        );
        return true;
      } else {
        setError(response.message || "Không thể làm trống giỏ hàng.");
        showToast("error", response.message || "Không thể làm trống giỏ hàng.");
        return false;
      }
    } catch (err: unknown) {
      let errorMessage = "Lỗi khi làm trống giỏ hàng.";
      if (typeof err === "object" && err !== null) {
        const e = err as ErrorWithMessage;
        if (e.response?.data?.message) {
          errorMessage = e.response.data.message;
        } else if (e.message) {
          errorMessage = e.message;
        }
      }
      setError(errorMessage);
      showToast("error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isProductInCart = (productId: string): boolean => {
    return cart?.items.some((item) => item.productId === productId) || false;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        totalPrice,
        fetchCart,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        clearClientCart,
        updateCart,
        isProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
