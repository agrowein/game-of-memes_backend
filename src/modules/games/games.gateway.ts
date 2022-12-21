import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { GamesService } from "./games.service";
import { Server, Socket } from "socket.io";
import { JoinDto } from "./dto/socket/join.dto";
import { SocketGuard } from "../../jwt/socket.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(SocketGuard)
@WebSocketGateway()
export class GamesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private gameService: GamesService) {}

  @SubscribeMessage('join')
  handleJoin(client: Socket & { user: any }, payload: JoinDto) {
    const { id } = payload;
    client.join(id);
    const players = this.server.sockets.adapter.rooms.get(id);
    console.log(players, client.id);
    this.server.emit('join', client.user);
  }

  afterInit(server: any): any {
  }

  handleConnection(client: Socket, ...args: any[]): any {
  }

  handleDisconnect(client: Socket): any {
    console.log(this.server.sockets.adapter.rooms);
  }
}
