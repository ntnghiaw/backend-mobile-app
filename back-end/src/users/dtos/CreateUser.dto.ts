import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
