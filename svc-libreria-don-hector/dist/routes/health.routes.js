"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
const health_controller_1 = require("../controllers/health.controller");
const router = (0, express_1.Router)();
exports.healthRoutes = router;
const controller = new health_controller_1.HealthController();
const routes = {
    get: '/',
    post: '/'
};
router.get(routes.get, controller.check.bind(controller));
router.post(routes.post, controller.checkPost.bind(controller));
