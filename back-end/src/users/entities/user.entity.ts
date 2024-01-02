import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  id: string;
}
