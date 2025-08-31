import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthStubMiddleware } from './auth.stub.middleware';

@Module({
  providers: [AuthStubMiddleware],
  exports: [AuthStubMiddleware],
})
export class CommonModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthStubMiddleware)
      .forRoutes('*');
  }
}
