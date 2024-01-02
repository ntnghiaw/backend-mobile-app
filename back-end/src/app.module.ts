import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './service/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    FirebaseModule,
    MongooseModule.forRoot(
      'mongodb+srv://nghianguyen29:ekONVI2AZQ4hVrC1@cluster0.iwa2blc.mongodb.net/omurice',
    ),
    UsersModule,
    RecipesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
