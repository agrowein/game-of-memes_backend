import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SocketGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const headers = client.handshake.headers;

    const token = headers?.authorization?.split(' ')[1] ?? '';

    if (token) {
      const payload = this.jwtService.verify(token, { secret: 'secret' });
      client.user = { ...payload };
      return true;
    }

    client.emit('error', '401 Authorization');
    return false;
  }
}