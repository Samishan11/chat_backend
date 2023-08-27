import { Socket } from "socket.io";
import { Chat } from "../../model/chat.model";
import { Room } from "../../model/room.model";
import { FriendRequest } from "../../model/friendRequest.model";
import { User } from "../../model/user.model";
import { Notification } from "../../model/notification.model";
import { ObjectId } from "mongoose";

export const requestFriendSocket = async (
  socket: Socket,
  connectedUsers: any
) => {
  //  send request
  socket.on("send-request", async (data: any) => {
    try {
      if (!data) return;
      const { requestBy, requestTo } = data;
      const room = await Room.findOne({
        users: { $all: [requestBy, requestTo] },
      });
      const request = await FriendRequest.findOne({
        $or: [
          { requestBy: requestBy, requestTo: requestTo },
          { requestBy: requestTo, requestTo: requestBy },
        ],
      });
      if (room || request) return;
      const sendRequest = new FriendRequest({
        requestBy,
        requestTo,
        isAccepted: false,
        date: new Date().toDateString(),
      });
      await sendRequest.save();
      const user = await User.findOne({ _id: requestBy });
      const noti: any = {
        notificationBy: requestBy,
        notificationTo: requestTo,
        notification: `${user?.fullname} has send you a friend request.`,
        date: new Date(),
      };
      if (sendRequest) {
        var notification = await new Notification(data).save();
        emitSocket(connectedUsers, requestTo, "get-notification", noti);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  });

  //  accept request
  socket.on("accept-request", async (data: any) => {
    try {
      if (!data) return;
      const { requestBy, requestTo } = data;

      const request = await FriendRequest.findOne({
        $or: [
          { requestBy, requestTo },
          { requestBy: requestTo, requestTo: requestBy },
        ],
      });
      const user = await User.findOne({ _id: requestTo });

      if (!request) return;
      const createRoom = new Room({
        users: [requestBy, requestTo],
        isGroup: false,
      });
      await createRoom.save();
      request.isAccepted = true;
      request.roomId = createRoom._id;
      await request.save();
      if (createRoom) {
        const noti: any = {
          notificationBy: requestTo,
          notificationTo: requestBy,
          notification: `${user?.fullname} has accept your friend request.`,
          date: new Date(),
        };
        var notification = await new Notification(noti).save();

        emitSocket(connectedUsers, requestBy, "get-notification", noti);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  });

  //  delete friend
  socket.on("remove-friend", async (data: any) => {
    try {
      const { id, roomId, user, friend } = data;
      await FriendRequest.findByIdAndDelete({ _id: id });
      await Chat.deleteMany({ roomId: roomId });
      await Room.findByIdAndDelete({ _id: roomId });
      await Notification.deleteMany({
        $or: [
          { notificationBy: user, notificationTo: friend },
          { notificationBy: friend, notificationTo: user },
        ],
      });
      // myself
      const listMyFriend = await FriendRequest.find({
        $or: [
          {
            requestTo: user,
          },
          { requestBy: user },
        ],
        isAccepted: true,
      })
        .populate("requestBy")
        .populate("requestTo");

      const socketname = "get-friend";
      emitSocket(connectedUsers, user, socketname, listMyFriend);
      //  friend
      const listFriend = await FriendRequest.find({
        $or: [
          {
            requestTo: friend,
          },
          { requestBy: friend },
        ],
        isAccepted: true,
      })
        .populate("requestBy")
        .populate("requestTo");
      emitSocket(connectedUsers, friend, socketname, listFriend);
    } catch (error: any) {
      console.log(error.message);
    }
  });
};

async function emitSocket(
  connectedUsers: Map<any, any>,
  userId: ObjectId,
  socketname: string,
  data: any
) {
  const matchingUser = Array.from(connectedUsers.values()).find(
    (user: any) => user.userId === userId
  );
  if (matchingUser) {
    const receiverSocket = matchingUser.socket;
    receiverSocket.emit(socketname, data);
  }
}
