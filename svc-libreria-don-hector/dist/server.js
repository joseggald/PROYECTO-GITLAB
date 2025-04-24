"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("./config/environment");
const Logger_1 = require("./utils/Logger");
const database_1 = require("./config/database");
const index_1 = require("./middlewares/index");
const routes_1 = require("./routes");
const errorHandler_1 = require("./middlewares/errorHandler");
class Server {
    constructor() {
        this.postgresConnection = null;
        // Log síncrono inmediato
        Logger_1.Logger.info('Initializing server...');
        this.app = (0, express_1.default)();
        this.setup();
    }
    setup() {
        Logger_1.Logger.info('Setting up server...');
        (0, index_1.initializeMiddlewares)(this.app);
        (0, routes_1.initializeRoutes)(this.app);
        this.app.use(errorHandler_1.errorHandler);
        Logger_1.Logger.ok('Server setup completed');
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info('Initializing databases...');
                yield database_1.dbManager.initialize();
                yield database_1.dbManager.connect();
                this.postgresConnection = database_1.dbManager.getConnection('postgres');
                if (this.postgresConnection) {
                    Logger_1.Logger.ok('PostgreSQL connected');
                }
                Logger_1.Logger.ok('Databases initialized');
            }
            catch (error) {
                Logger_1.Logger.error('Failed to initialize databases:', error);
                throw error;
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                Logger_1.Logger.info('Starting server...');
                yield this.initializeDatabase();
                const server = this.app.listen(environment_1.environment.PORT, () => {
                    Logger_1.Logger.ok(`Server running on port ${environment_1.environment.PORT} - ${environment_1.environment.NODE_ENV}`);
                    Logger_1.Logger.info(`Health check: GET-http://localhost:${environment_1.environment.PORT}/ && POST-http://localhost:${environment_1.environment.PORT}/ { pong:1 }`);
                    this.logServerInfo();
                });
                server.on('error', (error) => {
                    Logger_1.Logger.error(`HTTP server error: ${error.message}`);
                    this.shutdown(1);
                });
                process.on('SIGTERM', () => this.shutdown());
                process.on('SIGINT', () => this.shutdown());
            }
            catch (error) {
                Logger_1.Logger.error(`Server start failed: ${error.message}`);
                yield this.shutdown(1);
            }
        });
    }
    shutdown() {
        return __awaiter(this, arguments, void 0, function* (code = 0) {
            try {
                Logger_1.Logger.info('Server shutting down...');
                yield database_1.dbManager.disconnect();
                process.exit(code);
            }
            catch (error) {
                Logger_1.Logger.error(`Error during shutdown: ${error.message}`);
                process.exit(1);
            }
        });
    }
    logServerInfo() {
        const memoryUsage = process.memoryUsage();
        Logger_1.Logger.debug('Server Information', {
            environment: environment_1.environment.NODE_ENV,
            nodeVersion: process.version,
            memoryUsage: {
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
            },
            pid: process.pid
        });
    }
    getApp() {
        return this.app;
    }
}
exports.default = Server;
