import { Socket } from "socket.io";

export type SocketWithUserData = Socket & {
    user: {
        id: string,
    }
};
