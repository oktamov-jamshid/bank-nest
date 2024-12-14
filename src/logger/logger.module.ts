import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule  implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // Barcha yo'nalishlarga middleware qo'llanadi
        consumer.apply(LoggerMiddleware).forRoutes('*');
      }
}
