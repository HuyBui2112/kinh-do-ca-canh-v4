/**
 * @file cart.ts
 * @description Định nghĩa các kiểu dữ liệu liên quan đến Giỏ hàng (Cart).
 */

// Interface cho một item trong giỏ hàng (tương ứng ICartItem ở backend)
export interface CartItem {
  productId: string; // ID của sản phẩm
  name: string; // Tên sản phẩm
  image: string; // URL hình ảnh sản phẩm
  price: number; // Giá sản phẩm tại thời điểm thêm vào giỏ
  quantity: number; // Số lượng sản phẩm
}

// Interface cho đối tượng giỏ hàng (tương ứng ICart ở backend)
export interface Cart {
  _id: string; // ID của giỏ hàng (thường được trả về từ backend sau khi tạo/lấy)
  userId: string; // ID của người dùng sở hữu giỏ hàng
  items: CartItem[]; // Danh sách các sản phẩm trong giỏ
  totalPrice: number; // Tổng tiền của giỏ hàng
  createdAt?: string | Date; // Thời gian tạo (có thể là string ISO hoặc Date object)
  updatedAt?: string | Date; // Thời gian cập nhật gần nhất
}

// Dữ liệu yêu cầu khi thêm sản phẩm vào giỏ hàng
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

// Dữ liệu yêu cầu khi cập nhật số lượng sản phẩm trong giỏ hàng
export interface UpdateCartItemRequest {
  // productId được truyền qua URL params
  quantity: number;
}

// Dữ liệu yêu cầu khi cập nhật toàn bộ giỏ hàng
export interface UpdateCartRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
}

// Kiểu dữ liệu cho phản hồi API liên quan đến giỏ hàng (chung)
export interface CartApiResponse {
  success: boolean;
  message: string;
  data: Cart | null; // Dữ liệu giỏ hàng, hoặc null nếu có lỗi/không tìm thấy
}

// Kiểu dữ liệu cụ thể cho phản hồi khi làm trống giỏ hàng
export interface ClearCartApiResponse {
  success: boolean;
  message: string;
  data: Cart | null; // Backend sẽ trả về đối tượng Cart với items là mảng rỗng
} 