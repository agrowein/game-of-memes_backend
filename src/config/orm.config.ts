import {ConfigService} from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

enum EnvOrmOptions {
    database = 'DB_NAME',
    host = 'DB_HOST',
    port = 'DB_PORT',
    username = 'DB_USERNAME',
    password = 'DB_PASSWORD',
}

export default async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>(EnvOrmOptions.host),
    port: configService.get<number>(EnvOrmOptions.port),
    database: configService.get<string>(EnvOrmOptions.database),
    username: configService.get<string>(EnvOrmOptions.username),
    password: configService.get<string>(EnvOrmOptions.password),
    synchronize: true,
    entities: ["dist/**/*.entity{.ts,.js}"],
});