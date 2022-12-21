import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { CardsModule } from "../cards/cards.module";
import { JwtModule } from "../../jwt/jwt.module";
import { GamesGateway } from './games.gateway';
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    CardsModule,
    JwtModule,
    UsersModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesGateway]
})
export class GamesModule {}
