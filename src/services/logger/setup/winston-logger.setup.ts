import winston from 'winston';
import { randomBytes } from 'crypto';
import { LogIndentation } from '../enum/log-indentation.enum';

const { combine, timestamp, colorize, json, label, printf, metadata } =
  winston.format;

const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';
const appVersion = process.env.npm_package_version;

const generateLogId = (): string => randomBytes(16).toString('hex');

// Logger for API endpoints
export const httpLogger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        logId: generateLogId(),
        timestamp,
        appInfo: {
          appVersion,
          environment: process.env.NODE_ENV, // development/staging/production
          proccessId: process.pid,
        },
        message,
        data,
      };

      return JSON.stringify(response, null, LogIndentation.MD);
    })
  ),
  transports: [
    // log to console only
    new winston.transports.Console({
      // if set to true, logs will not appear
      silent: process.env.NODE_ENV === 'test_env' // true/false
    })
  ],
});

// Logger for MongoDB
export const httpLoggerDB = winston.createLogger({
  format: combine(
    json(),
    metadata()
  ),
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === 'test_env'
    })
  ]
});

// Logger for CLI outputs
export const cliLogger = winston.createLogger({
  format: combine(
    label({ label: appVersion }),
    timestamp({ format: timestampFormat }),
    colorize({ level: true }),
    printf(
      ({ level, message, label, timestamp }) =>
        `[${timestamp}] ${level} (${label}): ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});
