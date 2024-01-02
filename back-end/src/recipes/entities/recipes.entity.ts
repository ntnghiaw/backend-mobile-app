import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';

export class Recipes {
  @ApiProperty({ type: [OmitType(Recipe, ['steps', 'ingredients'])] })
  result: Recipe[];
}
