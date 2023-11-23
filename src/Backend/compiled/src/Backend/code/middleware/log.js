import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
var errorTransport = new DailyRotateFile({
    filename: './logs/errors/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '14d',
    level: 'error',
});
var infosTransport = new DailyRotateFile({
    filename: './logs/infos/requests-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '14d',
    level: 'info',
});
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [errorTransport, infosTransport],
});
export default logger;
