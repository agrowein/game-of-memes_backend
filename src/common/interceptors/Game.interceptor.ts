import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../../modules/users/users.service";
import { AuthService } from "../../modules/auth/auth.service";

@Injectable()
export class GameInterceptor implements NestInterceptor {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.token.split(' ')[1] ?? '';

    const { id } = await this.authService.verifyToken(token);

    const user = await this.usersService.findOne(id);

    client.user.currentGame = user?.currentGame ?? null;

    return next.handle();
  }

}