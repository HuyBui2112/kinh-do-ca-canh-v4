"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  ShoppingBag,
  AlertCircle,
  Loader2,
  Minus,
  Plus,
  X,
  Save,
} from "lucide-react";
import { formatPrice } from "@/utils/formatters";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function CartPage() {
  const {
    cart,
    loading: cartLoading,
    error: cartError,
    itemCount,
    totalPrice,
    updateItemQuantity,
    removeFromCart,
    clearClientCart,
    fetchCart,
    updateCart,
  } = useCart();
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const { showToast, confirmAction } = useToast();

  // Lưu trữ các thay đổi tạm thời
  const [updatingQuantities, setUpdatingQuantities] = useState<
    Record<string, string>
  >({});
  // Lưu trữ danh sách các sản phẩm đã thay đổi
  const [changedItems, setChangedItems] = useState<Set<string>>(new Set());
  // Trạng thái đang cập nhật
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Sử dụng biến để kiểm soát việc gọi API và tránh memory leak
      let isActive = true;

      // Chỉ gọi fetchCart nếu component vẫn mounted
      fetchCart().then(() => {
        if (!isActive) return;
      });

      // Cleanup function khi component unmount
      return () => {
        isActive = false;
      };
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (cart && cart.items) {
      const initialQuantities: Record<string, string> = {};
      cart.items.forEach((item) => {
        initialQuantities[item.productId] = item.quantity.toString();
      });
      setUpdatingQuantities(initialQuantities);
      // Reset danh sách thay đổi khi giỏ hàng được tải lại
      setChangedItems(new Set());
    }
  }, [cart]);

  // Đánh dấu sản phẩm đã thay đổi
  const markItemAsChanged = (productId: string) => {
    setChangedItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(productId);
      return newSet;
    });
  };

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (productId: string, newQuantityStr: string) => {
    setUpdatingQuantities((prev) => ({ ...prev, [productId]: newQuantityStr }));
    markItemAsChanged(productId);
  };

  // Tăng số lượng
  const handleIncrementQuantity = (productId: string) => {
    const currentQuantityStr = updatingQuantities[productId] || "0";
    const currentQuantity = parseInt(currentQuantityStr, 10);

    if (!isNaN(currentQuantity)) {
      const newQuantityStr = (currentQuantity + 1).toString();
      setUpdatingQuantities((prev) => ({
        ...prev,
        [productId]: newQuantityStr,
      }));
      markItemAsChanged(productId);
    }
  };

  // Giảm số lượng
  const handleDecrementQuantity = (productId: string) => {
    const currentQuantityStr = updatingQuantities[productId] || "0";
    const currentQuantity = parseInt(currentQuantityStr, 10);

    if (!isNaN(currentQuantity) && currentQuantity > 0) {
      const newQuantityStr = (currentQuantity - 1).toString();
      setUpdatingQuantities((prev) => ({
        ...prev,
        [productId]: newQuantityStr,
      }));
      markItemAsChanged(productId);
    }
  };

  // Đánh dấu xóa sản phẩm (đặt số lượng = 0)
  const markItemForRemoval = (productId: string) => {
    confirmAction(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
      () => {
        setUpdatingQuantities((prev) => ({ ...prev, [productId]: "0" }));
        markItemAsChanged(productId);
        showToast(
          "info",
          "Đã đánh dấu sản phẩm để xóa. Nhấn 'Cập nhật giỏ hàng' để xác nhận."
        );
      },
      {
        type: "warning",
        confirmLabel: "Xóa",
        cancelLabel: "Hủy",
      }
    );
  };

  // Xử lý cập nhật giỏ hàng
  const handleApplyChanges = async () => {
    if (changedItems.size === 0) return;

    setIsUpdating(true);
    try {
      // Chuyển đổi dữ liệu cập nhật
      const updatedItems = Array.from(changedItems).map((productId) => {
        const quantity = parseInt(updatingQuantities[productId] || "0", 10);
        return { productId, quantity };
      });

      // Quyết định sử dụng API nào dựa trên số lượng mục đã thay đổi
      if (changedItems.size === 1) {
        // Trường hợp chỉ thay đổi 1 sản phẩm
        const [item] = updatedItems;

        if (item.quantity === 0) {
          // Xóa sản phẩm
          await removeFromCart(item.productId);
          showToast("success", "Đã xóa sản phẩm khỏi giỏ hàng.");
        } else {
          // Cập nhật số lượng
          await updateItemQuantity(item.productId, item.quantity);
          showToast("success", "Đã cập nhật số lượng sản phẩm.");
        }
      } else {
        // Trường hợp thay đổi nhiều sản phẩm
        await updateCart(updatedItems);
        showToast("success", "Đã cập nhật giỏ hàng thành công.");
      }

      // Reset danh sách thay đổi sau khi cập nhật thành công
      setChangedItems(new Set());
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      showToast("error", "Không thể cập nhật giỏ hàng. Vui lòng thử lại sau.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Xử lý xóa tất cả sản phẩm khỏi giỏ hàng
  const handleClearCart = () => {
    confirmAction(
      "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
      async () => {
        try {
          await clearClientCart();
          showToast("success", "Đã xóa tất cả sản phẩm khỏi giỏ hàng.");
        } catch (error) {
          console.error("Lỗi khi xóa giỏ hàng:", error);
          showToast("error", "Không thể xóa giỏ hàng. Vui lòng thử lại sau.");
        }
      },
      {
        type: "warning",
        confirmLabel: "Xóa tất cả",
        cancelLabel: "Hủy",
      }
    );
  };

  // Kiểm tra có thay đổi chưa áp dụng không
  const hasUnappliedChanges = changedItems.size > 0;

  if (userLoading) {
    return (
      <div className="container mx-auto">
        <Breadcrumbs items={[{ slug: "/gio-hang", label: "Giỏ hàng" }]} />
        <div className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
          <p className="mt-4 text-lg text-gray-700">
            Đang tải thông tin người dùng...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        <Breadcrumbs items={[{ slug: "/gio-hang", label: "Giỏ hàng" }]} />
        <div className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-16 w-16 text-sky-500 mb-6" />
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Giỏ hàng của bạn
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Vui lòng đăng nhập để xem giỏ hàng và tiếp tục mua sắm.
          </p>
          <Link href="/dang-nhap">
            <Button
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Đăng nhập ngay
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cartLoading && !cart) {
    return (
      <div className="container mx-auto">
        <Breadcrumbs items={[{ slug: "/gio-hang", label: "Giỏ hàng" }]} />
        <div className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600" />
          <p className="mt-4 text-lg text-gray-700">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container mx-auto">
        <Breadcrumbs items={[{ slug: "/gio-hang", label: "Giỏ hàng" }]} />
        <div className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-16 w-16 text-rose-500 mb-6" />
          <h1 className="text-3xl font-semibold text-rose-700 mb-4">
            Lỗi Giỏ Hàng
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Không thể tải thông tin giỏ hàng của bạn.
          </p>
          <p className="text-md text-gray-500 mb-8">
            Chi tiết lỗi: {cartError}
          </p>
          <Button
            onClick={() => fetchCart()}
            size="lg"
            variant="outline"
            className="border-sky-600 text-sky-600 hover:bg-sky-50"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto">
        <Breadcrumbs items={[{ slug: "/gio-hang", label: "Giỏ hàng" }]} />
        <div className="container mx-auto p-4 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-16 w-16 text-sky-500 mb-6" />
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Giỏ hàng trống
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá và thêm sản
            phẩm nhé!
          </p>
          <Link href="/san-pham">
            <Button
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ slug: "/gio-hang", label: "Giỏ hàng" }]} />

        <h1 className="text-2xl md:text-3xl font-bold text-sky-600 mt-4 mb-2 lg:mb-4">
          Giỏ hàng của bạn
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <div className="flex justify-between items-center border-b border-sky-900/30 pb-4 mb-4">
                <h2 className="text-xl font-medium text-gray-700">
                  {itemCount} sản phẩm trong giỏ
                </h2>
                <div className="flex gap-2">
                  {/* Nút xóa tất cả */}
                  {itemCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-red-600 border-red-500 hover:bg-red-50 hover:text-red-700"
                      disabled={cartLoading || isUpdating}
                    >
                      {cartLoading &&
                      updatingQuantities["ALL"] === "CLEARING" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Xóa tất cả
                    </Button>
                  )}
                </div>
              </div>

              {cart.items.map((item) => {
                const originalQuantity = item.quantity;
                const currentQuantity = parseInt(
                  updatingQuantities[item.productId] || "0",
                  10
                );
                const isChanged =
                  changedItems.has(item.productId) &&
                  originalQuantity !== currentQuantity;

                return (
                  <div
                    key={item.productId}
                    className={`grid md:grid-cols-10 items-center justify-between border-b border-sky-900/30 mb-4 last:border-b-0 ${
                      isChanged ? "bg-sky-50" : ""
                    }`}
                  >
                    <div className="col-span-4 flex items-center mb-4 w-full">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4">
                        <Image
                          src={item.image || "/images/placeholder-product.png"}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base hover:text-sky-600">
                          <Link href={`/san-pham/${item.productId}`}>
                            {item.name}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between sm:justify-center w-full sm:w-auto gap-2 my-2 sm:my-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8"
                        onClick={() => handleDecrementQuantity(item.productId)}
                        disabled={
                          cartLoading ||
                          isUpdating ||
                          parseInt(updatingQuantities[item.productId] || "1") <=
                            0
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={updatingQuantities[item.productId] || "1"}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value)
                        }
                        className="w-16 h-6 sm:h-8 text-center border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                        min="0"
                        disabled={cartLoading || isUpdating}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8"
                        onClick={() => handleIncrementQuantity(item.productId)}
                        disabled={cartLoading || isUpdating}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="col-span-3 grid grid-cols-2">
                      <div className="text-sm font-medium text-gray-700 w-full sm:w-auto text-right sm:text-center my-2 sm:my-0">
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-sm font-semibold text-sky-700 w-full sm:w-auto text-right sm:text-center my-2 sm:my-0">
                        {formatPrice(
                          item.price *
                            parseInt(updatingQuantities[item.productId] || "0")
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-600 h-8 w-8 sm:h-10 sm:w-10"
                        onClick={() => markItemForRemoval(item.productId)}
                        disabled={cartLoading || isUpdating}
                        aria-label="Xóa sản phẩm"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* Hiển thị nút cập nhật phía dưới nếu có thay đổi */}
              {hasUnappliedChanges && (
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button
                    onClick={handleApplyChanges}
                    className="bg-sky-600 hover:bg-sky-700 text-white"
                    disabled={cartLoading || isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-5 w-5" />
                    )}
                    Cập nhật giỏ hàng
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
                Tổng cộng
              </h2>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Số lượng sản phẩm:</p>
                <p className="text-gray-800 font-medium">{itemCount}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tạm tính:</p>
                <p className="text-gray-800 font-medium">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold text-gray-900">
                    Thành tiền:
                  </p>
                  <p className="text-xl font-bold text-sky-600">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
                <Link href="/thanh-toan" passHref>
                  <Button
                    size="lg"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                    disabled={cartLoading || itemCount === 0}
                  >
                    {cartLoading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingBag className="mr-2 h-5 w-5" />
                    )}
                    Tiến hành Thanh toán
                  </Button>
                </Link>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/san-pham"
                  className="text-sm text-sky-600 hover:text-sky-700 hover:underline font-medium"
                >
                  Hoặc Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
