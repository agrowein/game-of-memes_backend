import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context, status) {
    if (err instanceof JsonWebTokenError) {
      throw new UnauthorizedException('Invalid JWT');
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
