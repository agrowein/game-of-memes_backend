import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { AuthenticationModule } from "../authentication/authentication.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    AuthenticationModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}