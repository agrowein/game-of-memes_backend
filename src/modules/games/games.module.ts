import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { CardsModule } from "../cards/cards.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    CardsModule,
  ],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}
