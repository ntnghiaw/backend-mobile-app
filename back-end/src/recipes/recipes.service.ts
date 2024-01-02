/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { ImageService } from 'src/service/upload-image.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { DetectIngredientDto } from './dto/detect-ingredient.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly imageService: ImageService,
    private readonly httpService: HttpService,
  ) {}

  async create(
    image: Express.Multer.File,
    { userId, ...recipeData }: CreateRecipeDto,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //upload image to firebase
    const imageUrl = await this.imageService.uploadImage(image);
    if (!imageUrl) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const newRecipe = new this.recipeModel({
      ...recipeData,
      imageUrl: imageUrl,
      createdBy: user._id,
    });
    return newRecipe.save();
  }

  async findAll() {
    return this.recipeModel.find();
  }

  async findOne(id: string) {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    if (isObjectId) {
      return this.recipeModel.findById(id).populate('createdBy');
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `https://webknox-recipes.p.rapidapi.com/recipes/${id}/information`,
          {
            headers: {
              'X-RapidAPI-Key':
                '275ca6970fmshd8b15450255ec05p117638jsn1db1839901b8',
              'X-RapidAPI-Host': 'webknox-recipes.p.rapidapi.com',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw 'Cannot find any recipe!';
          }),
        ),
    );
    const ingredients = data.analyzedInstructions[0].steps.map((step) => {
      return step.ingredients.map((ingredient) => {
        return ingredient.localizedName;
      });
    });
    const steps = data.analyzedInstructions[0].steps.map((step) => { 
      return step.step;
    });
    const flatIngredients = ingredients.flat();
    const uniqueArray = [...new Set(flatIngredients)];
    return {
      name: data.title,
      readyInMinutes: data.readyInMinutes,
      imageUrl: data.image,
      description: data.instructions,
      steps: steps,
      ingredients: uniqueArray,
    };
  }

  async update(
    id: string,
    image: Express.Multer.File,
    updateRecipeDto: UpdateRecipeDto,
  ) {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe)
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    const imageUrl = await this.imageService.uploadImage(image);
    if (!imageUrl) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const updatedRecipe = {
      imageUrl: imageUrl,
      ...updateRecipeDto,
    };
    return this.recipeModel.findByIdAndUpdate(id, updatedRecipe, {
      returnDocument: 'after',
      new: true,
    });
  }

  async detectIngredient(detectIngredientDto: DetectIngredientDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `http://127.0.0.1:9999/detect?image_url=${detectIngredientDto.imageUrl}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened!';
          }),
        ),
    );
    console.log(data.results);
    return data.results;
  }

  async findByIngredients(searchRecipeDto: SearchRecipeDto) {
    const ingredients = searchRecipeDto.ingredients.toString();
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `https://webknox-recipes.p.rapidapi.com/recipes/findByIngredients?ingredients=${ingredients}&number=10`,
          {
            headers: {
              'X-RapidAPI-Key':
                '275ca6970fmshd8b15450255ec05p117638jsn1db1839901b8',
              'X-RapidAPI-Host': 'webknox-recipes.p.rapidapi.com',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw 'Cannot find any recipe!';
          }),
        ),
    );
    const recipes = data.map((recipe) => {
      return {
        id: recipe.id,
        name: recipe.title,
        imageUrl: recipe.image,
        usedIngredientCount: data.usedIngredientCount,
        missedIngredientCount: data.missedIngredientCount,
      };
    });
    console.log(recipes);
    return recipes;
  }

  remove(id: string) {
    return this.recipeModel.findByIdAndDelete(id);
  }
}
