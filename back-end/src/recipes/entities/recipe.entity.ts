/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class Recipe {
  
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  duration: number;
  @ApiProperty()
  ingredients: Array<string>;
  @ApiProperty()
  steps: Array<string>;
  @ApiProperty()
  userId: string;
}
