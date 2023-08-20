import { Server, Socket } from "socket.io";
import { chatSocket } from "../controller/chat/chat.socket";
import { roomSocket } from "../controller/room/room.socket";

export const connectedUsers = new Map();
//  socket setup
export class SocketSetUp {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.initializeSocket();
  }

  //   socket initialize
  private initializeSocket() {
    // socket connect
    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected:", socket.handshake.query.userId);
      const userId = socket.handshake.query.userId;
      connectedUsers.set(socket.id, {
        userId: userId,
        socket: socket,
      });
      // chat socket
      chatSocket(socket, connectedUsers);
      roomSocket(socket);

      //   socket disconnect here
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
}
