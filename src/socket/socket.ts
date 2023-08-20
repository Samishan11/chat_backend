import { Server, Socket } from "socket.io";

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
      console.log("A user connected");

      //   socket disconnect here
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
}