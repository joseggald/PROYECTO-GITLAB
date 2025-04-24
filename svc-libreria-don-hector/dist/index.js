"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const Logger_1 = require("./utils/Logger");
const server = new server_1.default();
process.on('unhandledRejection', (error) => {
    Logger_1.Logger.error('Unhandled Rejection:', error);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    Logger_1.Logger.error('Uncaught Exception:', error);
    process.exit(1);
});
server.start().catch((error) => {
    Logger_1.Logger.error('Failed to start server:', error);
    process.exit(1);
});
