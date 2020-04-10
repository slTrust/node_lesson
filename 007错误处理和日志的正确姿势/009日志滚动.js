const winston = require('winston');
require('winston-daily-rotate-file');

const { Logger, transports } = winston;

const reqLogger = new Logger({
    transports: [
        new (transports.Console)(),
        new transports.DailyRotateFile({
            filename: './logs/req_log.log',
            datePattern: 'yyyy_MM_dd.',
            prepend: true, // 代表日期在作为前缀还是后缀
            level: 'info',
        })
    ]
});

const err = new Error('错误啦！')
reqLogger.info('request my client', {a:1,b:2,err:err.stack} );