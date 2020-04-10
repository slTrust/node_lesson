const winston = require('winston');
const { Logger, transports } = winston;

const logger = new Logger({
    transports: [
        new (transports.File)({
            name: 'info_logger',
            filename: 'logs/log_info.log',
            level: 'info'
        }),
        new (transports.File)({
            name: 'error_logger',
            filename: 'logs/log_error.log',
            level: 'error'
        }),
        new (transports.Console)(),
    ]
});

const reqLogger = new Logger({
    transports: [
        new (transports.File)({
            name: 'req_logger',
            filename: 'logs/req.log',
            level: 'info'
        }),
        new (transports.Console)(),
    ]
});

logger.info('my first logger info msg ');
logger.error('my first logger error msg ');


reqLogger.info('request my client');