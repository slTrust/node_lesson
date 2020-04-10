const winston = require('winston');
const { Logger, transports } = winston;
const logger = new Logger({
    transports: [
        new (transports.File)({
            name: 'info_logger',
            filename: 'logs/info.log',
            level: 'info'
        }),
        new (transports.Console)(),
    ]
});

// 高于 info级别也会被记录在 logs/info.log 里
logger.info('my first log info msg ')
logger.error('my first log error msg ')


const logger2 = new Logger({
    transports: [
        new (transports.File)({
            name: 'error_logger',
            filename: 'logs/error2.log',
            level: 'error'
        }),
        new (transports.Console)(),
    ]
});
// 只有 error级别被记录在 logs/error2.log 里
logger2.info('my first logger2 info msg ');
logger2.error('my first logger2 error msg ');



const logger3 = new Logger({
    transports: [
        new (transports.File)({
            name: 'info_logger',
            filename: 'logs/info3.log',
            level: 'info'
        }),
        new (transports.File)({
            name: 'error_logger',
            filename: 'logs/error3.log',
            level: 'error'
        }),
        new (transports.Console)(),
    ]
});

// 高于等于info级别记录在 logs/info3.log里， error级别 记录在 logs/error3.log 里
logger3.info('my first logger3 info msg ');
logger3.error('my first logger3 error msg ');