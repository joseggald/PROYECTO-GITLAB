"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const parser_1 = require("./database/parser");
const configValidator_1 = require("../utils/configValidator");
const Logger_1 = require("../utils/Logger");
// Cargar variables de entorno
dotenv_1.default.config();
// Habilitar modo debug
const DEBUG = process.env.DEBUG === 'true';
// Log de inicio de carga de configuración
if (DEBUG) {
    Logger_1.Logger.debug('Loading environment configuration...');
}
// Validar variables de entorno requeridas
(0, configValidator_1.validateEnvConfig)(process.env);
// Configurar bases de datos dinámicamente
const databases = parser_1.DatabaseConfigParser.parse(process.env);
if (DEBUG) {
    Logger_1.Logger.debug(`Found ${databases.length} database configurations`);
}
// Crear el objeto de ambiente
exports.environment = {
    // Configuración del servidor
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    API_PREFIX: process.env.API_PREFIX || '/api',
    DEBUG: DEBUG,
    // Configuración de bases de datos
    DATABASES: {
        default: `${process.env.DB_TYPE || 'postgres'}-${process.env.DB_ALIAS || 'default'}`, // Cambiado a postgres por defecto
        configs: databases
    },
    // Configuración de seguridad
    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
        REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d'
    },
    // Configuración de contraseñas
    PASSWORD: {
        SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),
        MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
        MAX_LENGTH: parseInt(process.env.PASSWORD_MAX_LENGTH || '50', 10)
    },
    // configuracion de email
    EMAIL: {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        EMAIL_RECEIVER: process.env.EMAIL_RECEIVER
    },
    // Método helper para obtener información de base de datos
    getDbConfig: (type, alias = 'default') => {
        const connectionKey = `${type}-${alias}`;
        const config = databases.find(db => db.type === type && db.alias === alias);
        if (!config) {
            throw new Error(`No database configuration found for ${connectionKey}`);
        }
        return config;
    }
};
// Log de configuración final en modo debug
if (DEBUG) {
    const sanitizedConfig = Object.assign(Object.assign({}, exports.environment), { JWT: Object.assign(Object.assign({}, exports.environment.JWT), { SECRET: '***********' }), DATABASES: Object.assign(Object.assign({}, exports.environment.DATABASES), { configs: exports.environment.DATABASES.configs.map(config => (Object.assign(Object.assign({}, config), { password: '********', url: config.url ? '********' : undefined }))) }) });
    Logger_1.Logger.debug('Final environment configuration:', sanitizedConfig);
}
// Validaciones adicionales de seguridad
if (!exports.environment.JWT.SECRET) {
    throw new Error('JWT_SECRET is required');
}
if (exports.environment.NODE_ENV === 'production') {
    // Validaciones específicas para producción
    const requiredProductionVars = [
        'PG_HOST',
        'PG_DATABASE',
        'PG_USER',
        'PG_PASSWORD',
        'JWT_SECRET'
    ];
    const missingVars = requiredProductionVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required production environment variables: ${missingVars.join(', ')}`);
    }
}
exports.default = exports.environment;
