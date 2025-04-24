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
exports.dbManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pg_1 = require("pg");
const promise_1 = __importDefault(require("mysql2/promise"));
const Logger_1 = require("../../utils/Logger");
const parser_1 = require("./parser");
class DatabaseManager {
    constructor() {
        this.connections = new Map();
        this.configs = new Map();
        this.CONNECTION_TIMEOUT = 15000; // 15 segundos
    }
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const configs = parser_1.DatabaseConfigParser.parse(process.env);
                if (configs.length === 0) {
                    yield Logger_1.Logger.warn('No database configurations found in environment variables');
                }
                for (const config of configs) {
                    const connectionKey = `${config.type}-${config.alias}`;
                    this.configs.set(connectionKey, config);
                    // Log de la configuración sin datos sensibles
                    const sanitizedConfig = Object.assign({}, config);
                    delete sanitizedConfig.password;
                }
            }
            catch (error) {
                yield Logger_1.Logger.error('Error parsing database configurations:', error);
                throw error;
            }
        });
    }
    connect(connectionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (connectionKey) {
                    yield this.connectOne(connectionKey);
                }
                else {
                    const connections = Array.from(this.configs.keys());
                    yield Logger_1.Logger.info(`Connecting to databases: ${connections.join(', ')}`);
                    for (const key of connections) {
                        yield this.connectOne(key);
                    }
                }
            }
            catch (error) {
                yield Logger_1.Logger.error('Database connection error:', error);
                throw error;
            }
        });
    }
    connectOne(connectionKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this.configs.get(connectionKey);
            if (!config) {
                throw new Error(`No configuration found for ${connectionKey}`);
            }
            try {
                const connectionPromise = this.createConnection(config);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Connection timeout for ${connectionKey}`)), this.CONNECTION_TIMEOUT);
                });
                const connection = yield Promise.race([connectionPromise, timeoutPromise]);
                this.connections.set(connectionKey, connection);
                yield Logger_1.Logger.ok(`Connected to database: ${connectionKey}`);
                // Configurar event listeners para MongoDB
                if (config.type === 'mongo' && connection) {
                    connection.on('error', (error) => __awaiter(this, void 0, void 0, function* () {
                        yield Logger_1.Logger.error(`MongoDB connection error (${connectionKey}):`, error);
                    }));
                    connection.on('disconnected', () => __awaiter(this, void 0, void 0, function* () {
                        yield Logger_1.Logger.warn(`MongoDB disconnected (${connectionKey})`);
                    }));
                    connection.on('reconnected', () => __awaiter(this, void 0, void 0, function* () {
                        yield Logger_1.Logger.ok(`MongoDB reconnected (${connectionKey})`);
                    }));
                }
            }
            catch (error) {
                yield Logger_1.Logger.error(`Failed to connect to ${connectionKey}:`, error);
                throw error;
            }
        });
    }
    createConnection(config) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (config.type) {
                case 'mongo':
                    if (!config.url) {
                        throw new Error(`MongoDB URL required for ${config.alias}`);
                    }
                    yield Logger_1.Logger.debug(`Creating MongoDB connection for ${config.alias}...`);
                    return mongoose_1.default.createConnection(config.url, {
                        serverSelectionTimeoutMS: this.CONNECTION_TIMEOUT,
                        connectTimeoutMS: this.CONNECTION_TIMEOUT,
                        socketTimeoutMS: this.CONNECTION_TIMEOUT
                    });
                case 'postgres':
                    yield Logger_1.Logger.debug(`Creating PostgreSQL connection for ${config.alias}...`);
                    return new pg_1.Pool({
                        host: config.host,
                        port: config.port,
                        user: config.username,
                        password: config.password,
                        database: config.database,
                        connectionTimeoutMillis: this.CONNECTION_TIMEOUT
                    });
                case 'mysql':
                    yield Logger_1.Logger.debug(`Creating MySQL connection for ${config.alias}...`);
                    return promise_1.default.createConnection({
                        host: config.host,
                        port: config.port,
                        user: config.username,
                        password: config.password,
                        database: config.database,
                        connectTimeout: this.CONNECTION_TIMEOUT
                    });
                default:
                    throw new Error(`Unsupported database type: ${config.type}`);
            }
        });
    }
    getConnection(type, alias = 'default') {
        const connectionKey = `${type}-${alias}`;
        const connection = this.connections.get(connectionKey);
        if (!connection) {
            throw new Error(`No active connection for ${connectionKey}`);
        }
        return connection;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [key, connection] of this.connections) {
                try {
                    yield Logger_1.Logger.info(`Disconnecting from ${key}...`);
                    if (connection === null || connection === void 0 ? void 0 : connection.close)
                        yield connection.close();
                    if (connection === null || connection === void 0 ? void 0 : connection.end)
                        yield connection.end();
                    yield Logger_1.Logger.info(`Disconnected from ${key}`);
                }
                catch (error) {
                    yield Logger_1.Logger.error(`Error disconnecting from ${key}:`, error);
                }
            }
            this.connections.clear();
        });
    }
}
exports.dbManager = DatabaseManager.getInstance();
