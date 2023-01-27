import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CardsModule } from './cards/cards.module';
import { GamesModule } from './games/games.module';
import ormConfig from '../config/orm.config';
import { AuthModule } from './auth/auth.module';
import { AccessTokenStrategy } from './auth/access-token.strategy';
import { RefreshTokenStrategy } from './auth/refresh-token.strategy';
import { MongooseModule } from "@nestjs/mongoose";
import { FilesModule } from './files/files.module';
import mongoConfig from "../config/mongo.config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ormConfig,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: mongoConfig,
    }),
    AuthModule,
    UsersModule,
    CardsModule,
    GamesModule,
    FilesModule,
  ],
  controllers: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class IndexModule {}
