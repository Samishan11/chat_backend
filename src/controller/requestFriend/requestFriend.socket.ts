import { Socket } from "socket.io";
import { Chat } from "../../model/chat.model";
import { Room } from "../../model/room.model";
import { FriendRequest } from "../../model/friendRequest.model";

export const requestFriendSocket = async (socket: Socket) => {
  socket.on("send-request", async (data: any) => {
    const { requestBy, requestTo } = data;
    const room = await Room.findOne({
      users: { $all: [requestBy, requestTo] },
    });
    if (room) return;
    const sendRequest = new FriendRequest({
      requestBy,
      requestTo,
      isAccepted: false,
      date: new Date().toDateString(),
    });
    await sendRequest.save();
    if (sendRequest) {
      const createRoom = new Room({
        users: [requestBy, requestTo],
        isGroup: false,
      });
      await createRoom.save();
    }
  });
};
