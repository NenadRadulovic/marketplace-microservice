import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { PgDatabaseModule, RmqModule } from '@app/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTHMS_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/auth-service/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_EXPIRES')} hours`,
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    PgDatabaseModule.register(),
    UsersModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, JwtStrategy, LocalStrategy],
})
export class AuthServiceModule {}
