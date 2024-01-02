import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiMethodNotAllowedResponse,
  ApiTags,
  ApiCreatedResponse,
  OmitType,
  ApiConsumes,
} from '@nestjs/swagger';
import { Recipe } from './entities/recipe.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { DetectIngredientDto } from './dto/detect-ingredient.dto';
import { SearchRecipeDto } from './dto/search-recipe.dto';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post('')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message(maxSize) {
              return `File is too large. Max file size is ${
                maxSize / 1024 / 1024
              } MB`;
            },
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() recipeData: CreateRecipeDto,
  ) {
    const { userId } = recipeData;
    const isValid = mongoose.Types.ObjectId.isValid(userId);
    if (!isValid)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.recipesService.create(image, recipeData);
  }

  @Get()
  @ApiOkResponse({
    type: OmitType(Recipe, ['steps', 'ingredients']),
    isArray: true,
    description: 'Success',
  })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.recipesService.findAll();
  }
  @Get('/detect')
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  detectIngredient(@Body() detectIngredientDto: DetectIngredientDto) {
    return this.recipesService.detectIngredient(detectIngredientDto);
  }

  @Get('/search')
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findByIngredients(@Body() searchRecipeDto: SearchRecipeDto) {
    return this.recipesService.findByIngredients(searchRecipeDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: Recipe, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async findOne(@Param('id') id: string) {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe)
      throw new HttpException('Recipe not found', HttpStatus.NOT_FOUND);
    return recipe;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message(maxSize) {
              return `File is too large. Max file size is ${
                maxSize / 1024 / 1024
              } MB`;
            },
          }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    console.log(updateRecipeDto);
    return this.recipesService.update(id, image, updateRecipeDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
