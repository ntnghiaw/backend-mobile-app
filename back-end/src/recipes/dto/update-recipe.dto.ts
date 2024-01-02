import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { CreateRecipeDto } from './create-recipe.dto';
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  name: string;
  @MaxLength(200)
  @ApiProperty()
  description: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  ingredients: Array<string>;
  @ApiProperty()
  steps: Array<string>;
}
