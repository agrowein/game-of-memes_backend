import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const auth = client.handshake.auth;

    const token = auth.token.split(' ')[1] ?? '';

    if (token) {
      const payload = await this.authService.verifyToken(token);

      client.user = { ...payload };
      return true;
    }

    client.emit('error', '401 Authorization');
    return false;
  }
}
