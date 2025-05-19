/**
 * Định dạng một số thành chuỗi tiền tệ VND.
 * @param price Số tiền cần định dạng.
 * @returns Chuỗi đã định dạng, ví dụ: "123.456 ₫".
 */
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) {
    return "0 ₫"; // Hoặc một giá trị mặc định khác bạn muốn
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}; 