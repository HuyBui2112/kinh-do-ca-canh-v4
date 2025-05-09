import express from 'express';
import { userController } from '@/controllers';
import { authenticate, hashPassword, validatePasswordStrength } from '@/middlewares';

const router = express.Router();

/**
 * @routes Auth
 * @description Routes xử lý xác thực người dùng
 */
// Đăng ký tài khoản mới
router.post(
  '/auth/register',
  validatePasswordStrength('info_auth.password'),
  hashPassword('info_auth.password'),
  userController.register
);

// Đăng nhập tài khoản
router.post(
  '/auth/login',
  userController.login
);

/**
 * @routes User
 * @description Routes xử lý thông tin người dùng
 * @middleware authenticate - Bảo vệ các routes yêu cầu đăng nhập
 */
// Lấy thông tin cá nhân
router.get('/users/profile', authenticate, userController.getProfile);

// Cập nhật thông tin cá nhân
router.patch('/users/profile', authenticate, userController.updateProfile);

// Đổi mật khẩu
router.patch(
  '/users/change-password',
  authenticate,
  validatePasswordStrength('newPassword'),
  userController.changePassword
);

export default router; 