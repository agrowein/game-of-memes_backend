import { JwtModule as NestJwtModule, JwtService } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import jwtConfig from "../config/jwt.config";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    })
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}