require("dotenv").config();

const ENVIRONMENT = process.env.ENVIRONMENT;
let dbCredentials = null;
if ((/PRODUCTION/).test(ENVIRONMENT)) {
    dbCredentials = {
        user: process.env.PROD_RDS_DB_USER || '',
        database: process.env.PROD_RDS_DB || '',
        password: process.env.PROD_RDS_DB_PASS || '',
        host: process.env.PROD_RDS_DB_HOST || '',
        port: 5432,
        ssl: { rejectUnauthorized: false },
        max: parseInt(process.env.DB_MAX_CLIENTS) || 20,
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS) || 30000
    }
}
else if ((/DEVELOPMENT/).test(ENVIRONMENT)) {
    dbCredentials = {
        user: process.env.RDS_DEV_DB_USER || '',
        database: process.env.RDS_DEV_DB_NAME || '',
        password: process.env.RDS_DEV_DB_PASS || '',
        host: process.env.RDS_DEV_DB_HOST || '',
        port: 5432,
        ssl: { rejectUnauthorized: false },
        max: parseInt(process.env.DB_MAX_CLIENTS) || 20,
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS) || 30000
    }
}
else {
    dbCredentials = {
        user: process.env.LOCAL_DB_USER || '',
        database: process.env.LOCAL_DB_NAME || '',
        password: process.env.LOCAL_DB_PASS || '',
        host: process.env.LOCAL_DB_HOST || '',
        port: 5432,
        // ssl: { rejectUnauthorized: false },
        max: parseInt(process.env.DB_MAX_CLIENTS) || 20,
        idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS) || 30000
    }
}
const config = {
    serviceName: process.env.SERVICENAME || 'PostgresDB',
    port: process.env.PORT || 4000,
    loggerLevel: process.env.LOGGERLEVEL || 'debug',
    db: dbCredentials,
    environment: ENVIRONMENT
}
module.exports = config;