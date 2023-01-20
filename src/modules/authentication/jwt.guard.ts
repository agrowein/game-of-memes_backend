import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import parseCookie from "../../utils/parseCookie";
import { JwtService } from "@nestjs/jwt";
import * as process from "process";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request?.headers;
    const cookie: Record<string, string> = parseCookie(headers?.cookie);

    if (!cookie) return false;

    let payload;
    try {
      //TODO: подумать как исправить jwtService
       payload = this.authenticationService.verify(cookie.access_token);
    } catch (e) {
      return false;
    }

    request.user = {
      ...payload,
    };

    return true;
  }
}