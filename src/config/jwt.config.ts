import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

enum EnvJwtOptions {
  secret = 'JWT_SECRET',
}

export default async (configService: ConfigService): Promise<JwtModuleOptions> => ({
  secretOrPrivateKey: configService.get<string>(EnvJwtOptions.secret),
  signOptions: {
    expiresIn: '1y',
  }
});
