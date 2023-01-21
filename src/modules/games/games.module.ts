import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { CardsModule } from "../cards/cards.module";
import { GamesGateway } from './games.gateway';
import { UsersModule } from "../users/users.module";
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    CardsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesGateway]
})
export class GamesModule {}
