import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import parseCookie from "../utils/parseCookie";
import { JwtService } from "@nestjs/jwt";
import * as process from "process";

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request?.headers;
    const cookie: Record<string, string> = parseCookie(headers?.cookie);

    if (!cookie) return false;
    console.log(cookie.access_token);

    let payload;
    try {
      //TODO: подумать как исправить jwtService
       payload = this.jwtService.verify(cookie.access_token, { secret: process.env.JWT_SECRET});
    } catch (e) {
      return false;
    }

    request.user = {
      ...payload,
    };

    return true;
  }
}