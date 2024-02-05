import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/common/database/entities';
import { BILLING_SERVICE, EMAIL_SERVICE, RmqModule } from '@app/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RmqModule.register({ name: EMAIL_SERVICE }),
    RmqModule.register({ name: BILLING_SERVICE }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
