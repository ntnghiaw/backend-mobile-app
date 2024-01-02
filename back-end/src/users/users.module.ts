import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './services/users/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersMiddleware } from './middlewares/users.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersMiddleware).forRoutes({
      path: 'users',
      method: RequestMethod.GET,
    });
  }
}
