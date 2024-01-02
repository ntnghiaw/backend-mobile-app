import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './CreateUser.dto';
import { Recipe } from 'src/recipes/entities/recipe.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  name: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  dayOfBirth: string;
  @ApiProperty()
  sex: string;
  @ApiProperty()
  recipes?: Array<Recipe>;
}
