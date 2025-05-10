import { Router } from 'express';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import reviewRoutes from './reviewRoutes';

const router = Router();

// Routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);

export default router;

