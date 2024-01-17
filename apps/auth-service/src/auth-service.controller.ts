import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { LocalGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@app/common/database/entities';
import { Response } from 'express';
import { JwtGuard } from './guards/jwt-auth.guard';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller('auth')
export class AuthServiceController {
  constructor(
    private readonly authServiceService: AuthServiceService,
    private readonly rmqService: RmqService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ): string {
    return this.authServiceService.login(user, response);
  }

  @UseGuards(JwtGuard)
  @MessagePattern('validate_user')
  validateUser(@CurrentUser() user: User) {
    return user;
  }

  @EventPattern('test_authms')
  authMsHealthcheck(): string {
    return 'Hello from AuthMS';
  }
}
