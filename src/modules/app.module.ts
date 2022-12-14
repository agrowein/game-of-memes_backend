import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import ormConfig from "../config/orm.config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: ormConfig,
      }),
      UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
