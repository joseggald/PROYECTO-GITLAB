import {Router} from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware'

import { ROLES } from '../dictionaries/roles'

const {  EMPLEADO } = ROLES;

const router = Router();

const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));


router.use(authMiddleware);
router.get('/product', roleMiddleware([EMPLEADO]),productController.getProduct.bind(productController));

export { router as productRoutes };