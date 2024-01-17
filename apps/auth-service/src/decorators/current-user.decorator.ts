import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '@app/common/database/entities';

export const getCurrentUserByContext = (context: ExecutionContext): User => {
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
