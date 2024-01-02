/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UpdateUserDto } from '../../dtos/UpdateUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  fetchAllUsers() {
    return '1';
  }

  fetchUserByID(id: string) {
    return this.userModel.findById(id);
  }

  async findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { email, password, ...newUpdatedUser } = updateUserDto;
    if (email) throw new HttpException('Email cannot be changed', 400);
    return this.userModel.findByIdAndUpdate(id, newUpdatedUser, { new: true });
  }

  delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
