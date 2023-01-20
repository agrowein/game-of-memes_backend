import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Observable } from "rxjs";

@Injectable()
export class SocketGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const auth = client.handshake.auth;

    const token = auth.token.split(' ')[1] ?? '';

    // if (token) {
    //   const payload = this.authenticationService.verify(token);
    //   client.user = { ...payload };
    //   return true;
    // }

    // client.emit('error', '401 Authorization');
    return false;
  }
}