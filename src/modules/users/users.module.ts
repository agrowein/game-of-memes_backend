import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { User } from "./entities/user.entity";
import { AuthenticationModule } from "../authentication/authentication.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    AuthenticationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
