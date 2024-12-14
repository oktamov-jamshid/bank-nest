// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

@Injectable()
export class LoggerService {
  private readonly errorLogger: Logger;
  private readonly accessLogger: Logger;

  constructor() {
    this.errorLogger = createLogger({
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'error-logs.log' }),
      ],
    });

    this.accessLogger = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'access-logs.log' }),
      ],
    });
  }

  logError(message: string, meta?: any) {
    this.errorLogger.error(message, { meta });
  }

  logInfo(message: string, meta?: any) {
    this.accessLogger.info(message, { meta });
  }

  logRequest(req: any, res: any) {
    this.accessLogger.info('Request received', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      body: req.body,
      query: req.query,
      timestamp: new Date().toISOString().split('T').join(' ').split('.')[0]
    });
  }

}
