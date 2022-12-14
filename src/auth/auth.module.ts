import { Module } from "@nestjs/common";
import { UsersModule } from "../modules/users/users.module";
import { AuthService } from "./auth.service";
import { JwtModule } from "../jwt/jwt.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    JwtModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}