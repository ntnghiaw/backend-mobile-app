import { ApiProperty } from '@nestjs/swagger';

export class DetectIngredientDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  imageUrl: any;
}
