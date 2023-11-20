import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const fileTransport = new DailyRotateFile({
    filename: './logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m',
    maxFiles: '14d',
    level: 'error',
});

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [fileTransport],
});

export default logger;
