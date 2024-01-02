import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/SignIn.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
  @Post('register')
  signUp(@Body() signInDto: SignInDto) {
    return this.authService.signUp(signInDto.email, signInDto.password);
  }
}
