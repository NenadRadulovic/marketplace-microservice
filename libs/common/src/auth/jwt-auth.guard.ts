import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../constants';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, tap } from 'rxjs';
import { Request } from 'express';

export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    return this.authService
      .send('validate_user', {
        Authentication: authentication,
      })
      .pipe(
        tap((res) => {
          this.addUser(res, context);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        }),
      );
  }

  private getAuthentication(context: ExecutionContext): string {
    let authentication: string;
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().user;
    }
    if (context.getType() === 'http') {
      authentication = context
        .switchToHttp()
        .getRequest<Request>()
        .header('x-ms-token');
    }
    if (!authentication) {
      throw new UnauthorizedException(
        'No value was provided for Authentication',
      );
    }
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
