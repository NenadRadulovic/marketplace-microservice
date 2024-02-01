import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@app/common/database/entities';
import { Response } from 'express';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  login(user: User, response: Response) {
    const tokenPayload = {
      email: user.email,
    };
    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: new Date().setHours(
        this.configService.get<number>('JWT_EXPIRES'),
      ),
    });

    response.appendHeader('X-MS-TOKEN', token);
    return token;
  }
}
