import { JwtModule as NestJwtModule, JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import jwtConfig from "../../config/jwt.config";
import { AuthenticationService } from "./authentication.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    })
  ],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}