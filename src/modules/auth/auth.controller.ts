import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { RefreshTokenGuard } from './refresh-token.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    try {
      return await this.authService.signIn(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    try {
      return await this.authService.signUp(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    const { id, refreshToken } = req.user;
    return await this.authService.refreshToken(id, refreshToken);
  }
}
