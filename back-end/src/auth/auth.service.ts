import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const flag = await bcrypt.compare(pass, user?.password);
    if (!flag) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.BAD_GATEWAY);
    }
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });
    if (!newUser) {
      throw new HttpException('Error creating user', HttpStatus.BAD_GATEWAY);
    }
    return {
      result: 'success',
    };
  }
}
