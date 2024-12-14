// src/logger/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: any, res: any, next: () => void) {
    res.on('finish', () => {
      // So'rovni loglash
      this.loggerService.logRequest(req, res);
    });
    next();
  }
}
