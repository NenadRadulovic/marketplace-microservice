import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';
import { User } from '@app/common/database/entities';
import * as bcrypt from 'bcrypt';
import { BILLING_SERVICE, EMAIL_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { StripeData } from '@app/common/constants/msData';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(EMAIL_SERVICE) private readonly emailService: ClientProxy,
    @Inject(BILLING_SERVICE) private readonly billingService: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    await this.validateCreateUser(createUserDto);
    const encodedPassword = await bcrypt.hash(createUserDto.password, 10);
    let newUser = await this.userRepository.createEntity({
      ...createUserDto,
      password: encodedPassword,
    } as User);

    const { stripeId } = await lastValueFrom<StripeData, StripeData>(
      this.billingService.send('create_stripe_user', newUser).pipe(),
      { defaultValue: { stripeId: null } },
    );

    newUser = await this.userRepository.updateEntity(newUser.id, {
      ...newUser,
      stripeId: stripeId,
    });

    return newUser as CreateUserDto;
  }

  private async validateCreateUser(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    let user: User;
    try {
      user = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
    } catch (err) {}
    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(userData: Partial<CreateUserDto>): Promise<User> {
    return await this.userRepository.findOneBy({ email: userData.email });
  }
}
