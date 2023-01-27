import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Server } from 'socket.io';
import { CreateGameDto } from './dto/create-game.dto';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { SocketGuard } from '../auth/socket.guard';
import { GameEmits, GameMessages } from './const';
import { Socket } from './games.types';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Gameplay } from "./interfaces/Gameplay.interface";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { GameInterceptor } from "../../common/interceptors/Game.interceptor";
import { CardsService } from "../cards/cards.service";
import { remove } from 'lodash';

@UseGuards(SocketGuard)
@UseInterceptors(GameInterceptor)
@WebSocketGateway(80, {
  cors: {
    origin: '*',
  },
})
export class GamesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectModel('Gameplay') private readonly gameplayModel: Model<Gameplay>,
    private gameService: GamesService,
    private usersService: UsersService,
    private authService: AuthService,
    private cardService: CardsService,
  ) {}

  @SubscribeMessage(GameMessages.CreateNew)
  async handleCreateGame(client: Socket, payload: CreateGameDto) {
    const game = await this.gameService.create(payload, client.user.id);
    this.server.sockets.emit(GameEmits.UpdatedGame, game);
  }

  @SubscribeMessage(GameMessages.UpdateAll)
  async handleGetGames(client: Socket) {
    const games = await this.gameService.findAll();
    client.emit(GameEmits.AllGames, games);
  }

  @SubscribeMessage(GameMessages.Join)
  async handleJoinToGame(client: Socket, gameID: string) {
    try {
      const game = await this.gameService.join(client.user.id, gameID);
      client.join(gameID);
      this.server.sockets.emit(GameEmits.UpdatedGame, game);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage(GameMessages.Status)
  async handleChangeStatus(client: Socket, status: boolean) {
    try {
      const user = await this.usersService.findOne(client.user.id);
      await this.gameService.setPlayerStatus(user.currentGame.id, user.id, status);

      this.server.to(user.currentGame.id).emit(GameEmits.ChangeStatus, {
        userId: user.id,
        newStatus: status,
      });
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage(GameMessages.Delete)
  async handleDeleteAllGames(client: Socket, id: string) {
    try {
      const deletedGame = await this.gameService.removeMyGame(
        client.user.id,
        id,
      );
      this.server.sockets.emit(GameEmits.DeletedGame, deletedGame);
    } catch (e) {
      client.emit(GameEmits.Error, e.message);
    }
  }

  @SubscribeMessage(GameMessages.Start)
  async handleStart(client: Socket) {
    try {
      const game = await this.gameService.start(client.user.id);
      setTimeout(() => {
        this.server.to(game.id).emit('game-start');
      }, 5000);

    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @SubscribeMessage('get-decks')
  async getDeck(client: Socket) {
    const game = await this.gameService.findOne(client.user.currentGame.id);
    client.emit('decks',  { situations: game.situations, pictures: game.pictures });
  }

  @SubscribeMessage('check-access-step')
  async handleCheckAccess(client: Socket) {
    const gameId = client.user.currentGame.id;
    const game = await this.gameplayModel.findOne({ gameId });

    const userId = game.stack[game.stack.length - 1];

    if (userId === client.user.id) client.emit('access', true);
    else client.emit('access', false);
  }

  @SubscribeMessage(GameMessages.ChooseSituation)
  async handleDoStep(client: Socket, cardId: string) {
    try {
      const game = await this.gameService.findOne(client.user.currentGame.id);
      game.situations = remove(game.situations, (s) => s.id === cardId);
      await this.gameService.update(client.user.currentGame.id, game);

      this.server.to(game.id).emit(GameEmits.PlayerChooseSituation, cardId);
    } catch (e) {
      throw e;
    }
  }

  @SubscribeMessage('play-next-round')
  async handlePlayRound(client: Socket) {

  }

  afterInit(server: any): any {}

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.auth.token.split(' ')[1];
      const { id } = await this.authService.verifyToken(token);
      const { currentGame } = await this.usersService.findOne(id);

      if (currentGame)
        client.join(currentGame.id);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  handleDisconnect(client: Socket): any {}
}
