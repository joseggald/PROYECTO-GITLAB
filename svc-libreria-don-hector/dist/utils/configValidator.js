"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnvConfig = validateEnvConfig;
function validateEnvConfig(env) {
    const requiredVars = [
        'PORT',
        'JWT_SECRET'
    ];
    const missingVars = requiredVars.filter(varName => !env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    // Validar que al menos haya una configuración de base de datos
    const hasDbConfig = (env.MONGO_URL ||
        (env.PG_HOST && env.PG_DATABASE) ||
        (env.MYSQL_HOST && env.MYSQL_DATABASE));
    if (!hasDbConfig) {
        throw new Error('At least one database configuration is required');
    }
}
