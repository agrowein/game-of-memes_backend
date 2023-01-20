import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  async signIn(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  verify(token) {
    return this.jwtService.verify(token);
  }
}