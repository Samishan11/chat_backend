import { Server, Socket } from "socket.io";
import { chatSocket } from "../controller/chat/chat.socket";
import { roomSocket } from "../controller/room/room.socket";
import { requestFriendSocket } from "../controller/requestFriend/requestFriend.socket";

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

      const user = Array.from(connectedUsers.values()).map(
        (data: any) => data.userId
      );

      //  remove duplicate
      const removeDuplicateUser = [...new Set(user)];
      // show all online users
      socket.emit("onlineUsers", removeDuplicateUser);

      // chat socket
      chatSocket(socket, connectedUsers);
      roomSocket(socket);
      requestFriendSocket(socket);

      //   socket disconnect here
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
}
