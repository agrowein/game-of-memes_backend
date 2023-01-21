import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { GamesService } from "./games.service";
import { Server } from "socket.io";
import { CreateGameDto } from "./dto/create-game.dto";
import { UseGuards } from "@nestjs/common";
import { SocketGuard } from "../auth/socket.guard";
import { GameEmits, GameMessages } from "./const";
import { Socket } from "./games.types";

@UseGuards(SocketGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GamesService) {}

  @SubscribeMessage(GameMessages.CreateNew)
  async handleCreateGame(client: Socket, payload: CreateGameDto) {
    const game = await this.gameService.create(payload, client.user.id);
    this.server.sockets.emit(GameEmits.UpdatedGame, game);
  }

  @SubscribeMessage(GameMessages.Delete)
  async handleDeleteAllGames(client: Socket, id: string) {
    try {
      const deletedGame = await this.gameService.removeMyGame(client.user.id, id);
      this.server.sockets.emit(GameEmits.DeletedGame, deletedGame);
    } catch (e) {
      client.emit(GameEmits.Error, e.message);
    }
  }

  @SubscribeMessage(GameMessages.UpdateAll)
  async handleGetGames(client: Socket & { user: any }) {
    const games = await this.gameService.findAll();
    client.emit(GameEmits.AllGames, games);
  }

  afterInit(server: any): any {
  }

  handleConnection(client: Socket, ...args: any[]): any {
  }

  handleDisconnect(client: Socket): any {
  }
}
