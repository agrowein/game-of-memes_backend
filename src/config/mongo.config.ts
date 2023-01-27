import { ConfigService } from "@nestjs/config";

export default async (configService: ConfigService) => ({
  uri: configService.get<string>('MONGOOSE_HOST'),
  dbName: 'memes',
})