import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { RecoveryDto } from "./dto/recovery.dto";
import { PASSWORD_NOT_CORRECT, USER_ALREADY_EXISTS, USER_NOT_FOUND } from "./errors";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { compare, hash } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new Error(USER_NOT_FOUND);

    const { password, ...other } = await this.usersService.getUserPassword(user.id);

    const passIsCorrect = await compare(pass, password);
    if (!passIsCorrect) throw new Error(PASSWORD_NOT_CORRECT);
    
    return other;
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) throw new Error(USER_NOT_FOUND);

    const { password } = await this.usersService.getUserPassword(user.id);

    const passIsCorrect = await compare(dto.password, password);
    if (!passIsCorrect) throw new Error(PASSWORD_NOT_CORRECT);

    const tokens = await this.getTokens(user.id, user.nickname);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async signUp(dto: SignUpDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) throw new Error(USER_ALREADY_EXISTS);

    const newUser = await this.usersService.create(dto as CreateUserDto);
    newUser.password = await hash(dto.password, 10);
    newUser.refreshToken = '';
    const tokens = await this.getTokens(newUser.id, newUser.nickname);
    await this.usersService.save(newUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return;
  }

  async recovery(dto: RecoveryDto) {
    //TODO: добавить когда будет связка с почтовым ящиком
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(id: string, token: string) {
    const user = await this.usersService.findOne(id);

    const isCorrect = await compare(token, user.refreshToken);
    if (!isCorrect) throw new Error("Чтото-там");

    const tokens = await this.getTokens(user.id, user.nickname);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}