import pino from 'pino';
import expressPino from 'express-pino-logger';

export const logger = pino({ level: process.env.LOG_LEVEL || 'error' });
export const expressLogger = expressPino({ logger });