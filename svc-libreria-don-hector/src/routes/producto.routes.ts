import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { BookController } from '../controllers/book.controller';
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware'
import { ROLES } from '../dictionaries/roles'

const {  EMPLEADO, SUPERVISOR, CLIENTE, GERENTE } = ROLES;

const router = Router();
const controller = new ProductController();
const bookController = new BookController();

router.get('/', bookController.searchBooks.bind(bookController));

router.use(authMiddleware)

router.get('/product', roleMiddleware([EMPLEADO,SUPERVISOR,CLIENTE,GERENTE]),controller.getProduct.bind(controller));
router.post("/add", roleMiddleware([SUPERVISOR,GERENTE]),controller.addProduct.bind(controller));
router.put("/update/:id", roleMiddleware([SUPERVISOR,GERENTE]),controller.updateProduct.bind(controller));
router.get("/Allproducts", roleMiddleware([EMPLEADO,SUPERVISOR,CLIENTE,GERENTE]),controller.getAllProducts.bind(controller));
router.delete("/delete/:id", roleMiddleware([SUPERVISOR]),controller.deleteProduct.bind(controller));
router.get("/top-rated", roleMiddleware([CLIENTE]),controller.getTopRated.bind(controller));
router.put("/bulk-update",roleMiddleware([SUPERVISOR,GERENTE]), controller.bulkUpdateProducts.bind(controller));


export { router as productoRoutes };