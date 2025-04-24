import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { ROLES } from '../dictionaries/roles'

const { CLIENTE, SUPERVISOR, EMPLEADO } = ROLES;
const controller  = new CommentController();
const router = Router();

router.use(authMiddleware);
router.get("/:id_producto", roleMiddleware([CLIENTE, SUPERVISOR, EMPLEADO]),controller.getByProductId.bind(controller));
router.post("/", roleMiddleware([CLIENTE, EMPLEADO]),controller.create.bind(controller));
router.put("/:id_comentario", roleMiddleware([CLIENTE]),controller.update.bind(controller));
router.delete("/:id_comentario", roleMiddleware([CLIENTE]),controller.delete.bind(controller));

export { router as commentRoutes };