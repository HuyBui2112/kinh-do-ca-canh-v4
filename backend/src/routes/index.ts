
import express from 'express';
import userRoutes from './userRoutes';

const router = express.Router();

// Đưa tất cả routes vào một router chung
router.use(userRoutes);

export default router;
