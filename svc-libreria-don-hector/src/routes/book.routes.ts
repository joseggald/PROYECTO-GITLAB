import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from '../dictionaries/roles'

const { CLIENTE, SUPERVISOR, EMPLEADO } = ROLES;
const controller = new BookController();
const router = Router();

router.use(authMiddleware);

router.post("/search", roleMiddleware([CLIENTE, EMPLEADO]), controller.searchBooks.bind(controller));
router.post("/add", roleMiddleware([SUPERVISOR]), controller.addBook.bind(controller));
router.put("/update/:id_producto", roleMiddleware([SUPERVISOR]), controller.updateBook.bind(controller));
router.delete("/delete/:id_producto", roleMiddleware([SUPERVISOR]), controller.deleteBook.bind(controller));

export { router as bookRoutes };