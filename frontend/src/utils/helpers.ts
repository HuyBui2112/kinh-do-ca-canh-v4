/**
 * Định dạng số thành định dạng tiền tệ VNĐ
 * @param amount Số tiền cần định dạng
 * @returns Chuỗi định dạng tiền tệ VNĐ
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Định dạng ngày tháng theo format Việt Nam
 * @param dateString Chuỗi ngày tháng
 * @returns Chuỗi đã được định dạng
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param text Văn bản cần rút gọn
 * @param maxLength Độ dài tối đa
 * @returns Văn bản đã được rút gọn
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Tạo URL thân thiện từ chuỗi
 * @param text Chuỗi cần chuyển đổi thành slug
 * @returns Slug được tạo ra
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
};

/**
 * Tính giá trị sao trung bình từ một mảng đánh giá
 * @param ratings Mảng các giá trị đánh giá
 * @returns Giá trị trung bình
 */
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}; 