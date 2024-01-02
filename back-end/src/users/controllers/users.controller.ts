import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiMethodNotAllowedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../services/users/users.service';
import { UpdateUserDto } from '../dtos/UpdateUser.dto';
import { User } from '../entities/user.entity';
import { AuthGuard } from '../guards/auth/auth.guard';
import mongoose from 'mongoose';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: User, isArray: true, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  findAll() {
    return this.userService.fetchAllUsers();
  }

  @Get(':id')
  @ApiOkResponse({ type: User, description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async findOne(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const user = await this.userService.fetchUserByID(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const updatedUser = await this.userService.update(id, userData);
    if (!updatedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return updatedUser;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Page Not Found' })
  @ApiMethodNotAllowedResponse({ description: 'Method Not Allowed' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    const deletedUser = await this.userService.delete(id);
    if (!deletedUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return deletedUser;
  }
}
