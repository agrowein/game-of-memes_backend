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
      this.server.to(gameID).emit('player-joined', client.user.id);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('leave')
  async handleLeave(client: Socket) {
    const game = await this.gameService.leave(client.user.id);
    this.server.emit(GameEmits.UpdatedGame, game);
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('update-status')
  async handleChangeStatus(client: Socket, status: boolean) {
    try {
      const user = await this.usersService.findOne(client.user.id);
      await this.gameService.setPlayerStatus(user.currentGame.id, user.id, status);

      this.server.to(user.currentGame.id).emit(GameEmits.ChangeStatus, {
        userId: user.id,
        status: status,
      });
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('refresh')
  async handleRefresh(client: Socket, id: string) {
    const gameplay = await this.gameService.getGameplay(id);

    client.emit('frame', gameplay);
  }

  @UseInterceptors(GameInterceptor)
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

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage(GameMessages.Start)
  async handleStart(client: Socket) {
    try {
      const gameplay = await this.gameService.start(client.user.id);
      this.server.to(gameplay.gameId).emit('game-start');
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('reaction')
  async handleReaction(client: Socket, reactionId: string) {
    try {
      const gameplay = await this.gameService.handleReaction(reactionId, client.user.currentGame.id, client.user.id);
      const allPlayersDoStep = !gameplay.currentRound.players.some((player) => {
        return !!gameplay.currentRound.reactions.get(player.id) === false;
      });
      if (allPlayersDoStep) {
        this.server.to(client.user.currentGame.id).emit('show-reactions');
        await this.gameService.playNextRound(client.user.currentGame.id);
      }
      this.server.to(client.user.currentGame.id).emit('frame', gameplay);
    } catch (e) {
      client.emit('error', e.message);
    }
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage(GameMessages.ReadyPlayRound)
  async handleReadyPlay() {}

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('get-decks')
  async getDeck(client: Socket) {
    const game = await this.gameService.findOne(client.user.currentGame.id);
    client.emit('decks');
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('do-step')
  async handleDoStep(client: Socket, cardId: string) {
    try {
      const userId = client.user.id;
      const gameId = client.user.currentGame.id;

      const reactions = await this.gameService.doStep(gameId, cardId, userId);

      if (reactions) {
        this.server.to(gameId).emit('reactions', reactions);
      }
    } catch (e) {
      throw e;
    }
  }

  @UseInterceptors(GameInterceptor)
  @SubscribeMessage('play-round')
  async handlePlayRound(client: Socket) {
    const situation = await this.gameService.playRound(client.user.currentGame.id);

    if (!situation) {
      this.server.to(client.user.currentGame.id).emit('game-over');
      return;
    }

    this.server.to(client.user.currentGame.id).emit('situation', situation);
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
