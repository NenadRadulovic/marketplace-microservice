import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RmqModule } from '../rmq/rmq.module';
import { AUTH_SERVICE } from '../constants';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE })],
  exports: [RmqModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply();
  }
}
