import { Router } from "express";
import { WishlistController } from "../controllers/wishlist.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from '../dictionaries/roles'

const { CLIENTE, EMPLEADO } = ROLES;


const controller = new WishlistController();
const router = Router();

router.use(authMiddleware);

router.post("/add", roleMiddleware([CLIENTE, EMPLEADO]), controller.addToWishlist.bind(controller));
router.get("/", roleMiddleware([CLIENTE, EMPLEADO]), controller.getWishlist.bind(controller));
router.post("/remove", roleMiddleware([CLIENTE, EMPLEADO]), controller.removeFromWishlist.bind(controller));

export { router as wishlistRoutes };
