"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeRoutes = void 0;
const express_1 = require("express");
const health_routes_1 = require("./health.routes");
const book_routes_1 = require("./book.routes");
const wishlist_routes_1 = require("./wishlist.routes");
const user_routes_1 = require("./user.routes");
const comment_routes_1 = require("./comment.routes");
const employee_routes_1 = require("./employee.routes");
const supervisor_routes_1 = require("./supervisor.routes");
const responses_1 = require("../utils/responses");
const producto_routes_1 = require("./producto.routes");
const invoice_routes_1 = require("./invoice.routes");
const salesReport_routes_1 = require("./salesReport.routes");
const { sendError } = responses_1.ResponseHandler;
const initializeRoutes = (app) => {
    const apiRouter = (0, express_1.Router)();
    // Rutas de API
    apiRouter.use('/', health_routes_1.healthRoutes);
    apiRouter.use('/users', user_routes_1.userRoutes);
    apiRouter.use('/clients', employee_routes_1.employeeRoutes);
    apiRouter.use('/invoice', invoice_routes_1.invoiceRoutes);
    // Agrega aquí otras rutas cuando las crees
    apiRouter.use('/productos', producto_routes_1.productoRoutes);
    apiRouter.use('/comentarios', comment_routes_1.commentRoutes);
    apiRouter.use('/libros', book_routes_1.bookRoutes);
    apiRouter.use('/wishlist', wishlist_routes_1.wishlistRoutes);
    apiRouter.use('/supervisor', supervisor_routes_1.supervisorRoutes);
    apiRouter.use('/reports', salesReport_routes_1.salesReportRoutes);
    // Prefijo global para todas las rutas de API
    app.use('', apiRouter);
    // Manejador de rutas no encontradas
    app.use('*', (req, res) => {
        sendError(res, `Route ${req.originalUrl} not found`, 404);
    });
};
exports.initializeRoutes = initializeRoutes;
