import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { GamesModule } from './games/games.module';
import ormConfig from "../config/orm.config";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ormConfig,
    }),
    AuthModule,
    UsersModule,
    CardsModule,
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
