import { Socket } from "socket.io";
import { Chat } from "../../model/chat.model";
import { Room } from "../../model/room.model";
import { FriendRequest } from "../../model/friendRequest.model";

export const requestFriendSocket = async (socket: Socket) => {
  socket.on("send-request", async (data: any) => {
    if (!data) return;
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

  socket.on("accept-request", async (data) => {
    if (!data) return;
    const { requestBy, requestTo } = data;

    const request = await FriendRequest.findOne({
      $or: [
        { requestBy, requestTo },
        { requestBy: requestTo, requestTo: requestBy },
      ],
    });
    console.log(data);
    console.log(request);

    if (!request) return;
    request.isAccepted = true;
    await request.save();
  });
};
