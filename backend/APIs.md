# API Documentation - Kinh Đô Cá Cảnh

## Tổng quan

Document này mô tả chi tiết các API endpoints cho hệ thống Kinh Đô Cá Cảnh, bao gồm cấu trúc request và response.

### Base URL

```
http://localhost:5000/api
```

### Định dạng Response

Tất cả API đều trả về response có cấu trúc chuẩn như sau:

#### Thành công

```json
{
  "status": "success",
  "message": "Thông báo thành công",
  "data": {
    // Dữ liệu trả về
  }
}
```

#### Lỗi

```json
{
  "status": "fail",
  "error": {
    "statusCode": 400, // Mã lỗi HTTP
    "status": "fail",
    "isOperational": true
  },
  "message": "Thông báo lỗi"
}
```

### Xác thực

Hầu hết các endpoints đều yêu cầu xác thực. Xác thực được thực hiện bằng cách thêm header `Authorization` vào request:

```
Authorization: Bearer <token>
```

Token được lấy từ API đăng nhập hoặc đăng ký.

---

## API Endpoints

### 1. Đăng ký tài khoản

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "info_user": {
    "username": {
      "lastname": "Nguyễn", 
      "firstname": "Văn A"
    },
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận XYZ, TP.HCM"
  },
  "info_auth": {
    "email": "example@gmail.com",
    "password": "Password123!"
  }
}
```

**Quy tắc xác thực:**
- Họ và tên không được để trống
- Số điện thoại phải có 10 chữ số
- Địa chỉ không được để trống
- Email phải hợp lệ và không trùng lặp
- Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt

**Response thành công (201):**
```json
{
  "status": "success",
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "email": "example@gmail.com",
    "info_user": {
      "username": {
        "lastname": "Nguyễn",
        "firstname": "Văn A"
      },
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận XYZ, TP.HCM"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response lỗi:**
- Email đã tồn tại (400)
- Thiếu thông tin (400)
- Email không hợp lệ (400)
- Mật khẩu yếu (400)

---

### 2. Đăng nhập

**Endpoint:** `POST /auth/login`

**Request Body:** (Hỗ trợ 2 format)

Format 1:
```json
{
  "info_auth": {
    "email": "example@gmail.com",
    "password": "Password123!"
  }
}
```

Format 2:
```json
{
  "email": "example@gmail.com",
  "password": "Password123!"
}
```

**Response thành công (200):**
```json
{
  "status": "success",
  "message": "Đăng nhập thành công",
  "data": {
    "email": "example@gmail.com",
    "info_user": {
      "username": {
        "lastname": "Nguyễn",
        "firstname": "Văn A"
      },
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận XYZ, TP.HCM"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response lỗi:**
- Email/mật khẩu không đúng (401)
- Thiếu thông tin (400)

---

### 3. Xem thông tin cá nhân

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response thành công (200):**
```json
{
  "status": "success",
  "data": {
    "email": "example@gmail.com",
    "info_user": {
      "username": {
        "lastname": "Nguyễn",
        "firstname": "Văn A"
      },
      "phone": "0123456789",
      "address": "123 Đường ABC, Quận XYZ, TP.HCM"
    }
  }
}
```

**Response lỗi:**
- Không có token (401)
- Token không hợp lệ (401)

---

### 4. Cập nhật thông tin cá nhân

**Endpoint:** `PATCH /users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:** (Cập nhật một hoặc nhiều trường)
```json
{
  "info_user": {
    "username": {
      "lastname": "Trần",
      "firstname": "Văn B"
    },
    "phone": "0987654321",
    "address": "456 Đường XYZ, Quận ABC, TP.HCM"
  }
}
```

**Response thành công (200):**
```json
{
  "status": "success",
  "message": "Cập nhật thông tin thành công",
  "data": {
    "email": "example@gmail.com",
    "info_user": {
      "username": {
        "lastname": "Trần",
        "firstname": "Văn B"
      },
      "phone": "0987654321",
      "address": "456 Đường XYZ, Quận ABC, TP.HCM"
    }
  }
}
```

**Response lỗi:**
- Không có thông tin cập nhật (400)
- Số điện thoại không hợp lệ (400)
- Lỗi xác thực (401)

---

### 5. Đổi mật khẩu

**Endpoint:** `PATCH /users/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

**Response thành công (200):**
```json
{
  "status": "success",
  "message": "Đổi mật khẩu thành công"
}
```

**Response lỗi:**
- Thiếu thông tin (400)
- Mật khẩu hiện tại không đúng (400)
- Mật khẩu mới quá ngắn (400)
- Lỗi xác thực (401)

---

## Các mã lỗi

| Mã lỗi | Mô tả |
|--------|-------|
| 400 | Bad Request - Yêu cầu không hợp lệ, thiếu dữ liệu hoặc dữ liệu không đúng định dạng |
| 401 | Unauthorized - Không có quyền truy cập, cần đăng nhập hoặc token không hợp lệ |
| 403 | Forbidden - Không có quyền thực hiện hành động này |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 500 | Internal Server Error - Lỗi server |

---

## Xử lý lỗi

Tất cả các lỗi đều được trả về với cấu trúc chuẩn. Frontend nên xử lý các lỗi dựa trên mã lỗi HTTP và thông báo được trả về trong trường `message`.

```json
{
  "status": "fail",
  "error": {
    "statusCode": 400,
    "status": "fail",
    "isOperational": true
  },
  "message": "Thông báo lỗi cụ thể"
}
```

## Lưu ý

- Token JWT hết hạn sau 1 ngày
- Mật khẩu phải tuân theo quy tắc bảo mật (ít nhất 6 ký tự, chữ hoa, chữ thường, số, ký tự đặc biệt)
- Email phải là duy nhất trong hệ thống
