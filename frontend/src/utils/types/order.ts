/**
 * @file order.ts
 * @description Định nghĩa các kiểu dữ liệu liên quan đến Đơn hàng (Order).
 */

// Interface cho địa chỉ giao hàng (tương ứng IShippingAddress ở backend)
export interface ShippingAddress {
  fullname: string; // Họ và tên người nhận
  address: string; // Địa chỉ chi tiết
  phone: string; // Số điện thoại người nhận (validate 10 số ở backend)
  city: string; // Thành phố/Tỉnh
  postalCode?: string; // Mã bưu điện (nếu có)
}

// Enum cho các trạng thái của đơn hàng (tương ứng OrderStatus ở backend)
export enum OrderStatus {
  PENDING = 'pending', // Chờ xác nhận / Đang chờ xử lý
  SHIPPING = 'shipping', // Đang giao hàng
  DELIVERED = 'delivered', // Đã giao thành công
  PAID = 'paid', // Đã thanh toán
  CANCELLED = 'cancelled', // Đã hủy
}

// Interface cho một sản phẩm trong đơn hàng
// Có thể giống hệt CartItem, hoặc có thêm/bớt trường tùy theo dữ liệu trả về từ API Order
export interface OrderItem {
  productId: string; // ID của sản phẩm
  name: string; // Tên sản phẩm
  image: string; // URL hình ảnh sản phẩm
  price: number; // Giá sản phẩm tại thời điểm thêm vào giỏ
  quantity: number; // Số lượng sản phẩm
}

// Interface cho đối tượng đơn hàng (tương ứng IOrder ở backend)
export interface Order {
  _id: string; // ID của đơn hàng
  userId: string; // ID của người dùng đặt hàng
  items: OrderItem[]; // Danh sách các sản phẩm trong đơn hàng
  shippingAddress: ShippingAddress; // Thông tin giao hàng
  paymentMethod: string; // Phương thức thanh toán (ví dụ: 'COD', 'OnlineBanking')
  totalPrice: number; // Tổng tiền của đơn hàng
  status: OrderStatus; // Trạng thái hiện tại của đơn hàng
  orderDate: string | Date; // Ngày đặt hàng (có thể là string ISO hoặc Date object)
  createdAt?: string | Date; // Thời gian tạo record đơn hàng
  updatedAt?: string | Date; // Thời gian cập nhật record đơn hàng gần nhất
}

// Dữ liệu yêu cầu khi tạo một đơn hàng mới
export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string; // Phương thức thanh toán (ví dụ: 'COD')
}

// Dữ liệu yêu cầu khi mua ngay một sản phẩm
export interface BuyNowOrderRequest extends CreateOrderRequest {
  productId: string; // ID của sản phẩm cần mua
  quantity: number; // Số lượng sản phẩm
}

// Kiểu dữ liệu cho phản hồi API liên quan đến một đơn hàng (chung)
export interface OrderApiResponse {
  success: boolean;
  message: string;
  data: Order | null;
}

// Kiểu dữ liệu cho phản hồi API khi lấy danh sách đơn hàng
export interface OrderListApiResponse {
  success: boolean;
  message: string;
  data: Order[];
  count?: number; // Tổng số đơn hàng
}

// Kiểu dữ liệu cho phản hồi khi hủy đơn hàng
export interface CancelOrderApiResponse {
  success: boolean;
  message: string;
  data: Order | null;
}

// Các params có thể có khi query danh sách đơn hàng (nếu có filter, sort ở frontend)
// export interface OrderListQueryParams {
//   status?: OrderStatus;
//   page?: number;
//   limit?: number;
//   sortBy?: 'orderDate' | 'totalPrice';
//   sortOrder?: 'asc' | 'desc';
// } 