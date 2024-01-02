import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return process.env.JWT_SECRET;
  }
}
