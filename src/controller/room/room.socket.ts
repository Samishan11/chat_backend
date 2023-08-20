import { Socket } from "socket.io";
import { Room } from "../../model/room.model";

export const roomSocket = async (socket: Socket) => {
  socket.on("join_room", async (data: any) => {
    socket.join(data);
    console.log(`Room join`);
  });
};
