import { Socket as SocketIO } from 'socket.io';

export type Socket = SocketIO & {
  user: {
    id: string;
    nickname: string;
    currentGame: any | null;
  };
};