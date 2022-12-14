import { Injectable } from "@nestjs/common";
import { UsersService } from "../modules/users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { RecoveryDto } from "./dto/recovery.dto";
import { PASSWORD_NOT_CORRECT, USER_ALREADY_EXISTS, USER_NOT_FOUND } from "./errors";
import { CreateUserDto } from "../modules/users/dto/create-user.dto";
import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import * as process from "process";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new Error(USER_NOT_FOUND);

    const { password } = await this.usersService.getUserPassword(user.id);

    const passIsCorrect = await compare(dto.password, password);
    if (!passIsCorrect) throw new Error(PASSWORD_NOT_CORRECT);

    const payload = {
      id: user.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_SECRET }),
    }
  }

  async signUp(dto: SignUpDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) throw new Error(USER_ALREADY_EXISTS);

    const newUser = await this.usersService.create(dto as CreateUserDto);
    newUser.password = await hash(dto.password, 10);
    await this.usersService.save(newUser);
    return;
  }

  async recovery(dto: RecoveryDto) {
    //TODO: добавить когда будет связка с почтовым ящиком
  }
}