import express, { Router } from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import reviewRoutes from "./reviewRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";

const router: Router = express.Router();

// Định nghĩa các routes API version 1
const apiV1Routes: Router = express.Router();
apiV1Routes.use("/users", userRoutes);
apiV1Routes.use("/products", productRoutes);
apiV1Routes.use("/reviews", reviewRoutes);
apiV1Routes.use("/cart", cartRoutes);
apiV1Routes.use("/orders", orderRoutes);

// Gắn routes API version 1 vào đường dẫn /api/v1
router.use("/api/v1", apiV1Routes);

export default router;

