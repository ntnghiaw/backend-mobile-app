import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from 'src/schemas/Recipe.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { FirebaseModule } from 'src/service/firebase.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    FirebaseModule,
    MongooseModule.forFeature([
      { name: Recipe.name, schema: RecipeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
