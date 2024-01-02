import { ApiProperty } from '@nestjs/swagger';

export class SearchRecipeDto {
  @ApiProperty()
  ingredients: Array<string>;
}
