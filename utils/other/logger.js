const config = require('../../config/config');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const loggerFormat = printf(info => {
    return `${info.timestamp} | ${info.level}: ${info.message}`;
});
 
const logger = createLogger({
    level: config.loggerLevel || "debug",
    format: combine(
        format.colorize(),
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.Console()
    ]
    });

module.exports = logger;