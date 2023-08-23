import { Socket } from "socket.io";
import { Chat } from "../../model/chat.model";
import { Room } from "../../model/room.model";
import { FriendRequest } from "../../model/friendRequest.model";
import { User } from "../../model/user.model";
import { Notification } from "../../model/notification.model";

export const requestFriendSocket = async (
  socket: Socket,
  connectedUsers: any
) => {
  //  send request
  socket.on("send-request", async (data: any) => {
    console.log("send");
    try {
      if (!data) return;
      const { requestBy, requestTo } = data;
      const room = await Room.findOne({
        users: { $all: [requestBy, requestTo] },
      });
      const request = await FriendRequest.findOne({
        $or: [
          { requestBy: requestBy, requestTo: requestBy },
          { requestBy: requestTo, requestTo: requestTo },
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
      console.log(user);
      if (sendRequest) {
        const data = {
          notificationBy: requestBy,
          notificationTo: requestTo,
          notification: `${user?.fullname} has send you a friend request.`,
          date: new Date(),
        };
        var notification = await new Notification(data).save();
        // const matchingUsers = Array.from(connectedUsers.values()).find(
        //   (user: any) => user.userId === requestTo
        // );
        // if (!matchingUsers) return;
        // matchingUsers.emit("get-notification", data);

        const matchingUsers = Array.from(connectedUsers.values()).filter(
          (user: any) => user.userId === requestTo
        );
        matchingUsers.forEach((user: any) => {
          const receiverSocket = user.socket;
          receiverSocket.emit("get-notification", data);
        });
      }
    } catch (error: any) {
      console.log("error");
      console.log(error.message);
    }
  });

  //  accept request
  socket.on("accept-request", async (data) => {
    console.log("accept");
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
        const data = {
          notificationBy: requestTo,
          notificationTo: requestBy,
          notification: `${user?.fullname} has accept your friend request.`,
          date: new Date(),
        };
        var notification = await new Notification(data).save();
        // const matchingUsers = Array.from(connectedUsers.values()).find(
        //   (user: any) => user.userId === requestTo
        // );
        // if (!matchingUsers) return;
        // matchingUsers.emit("get-notification", data);
        const matchingUsers = Array.from(connectedUsers.values()).filter(
          (user: any) => user.userId === requestBy
        );
        matchingUsers.forEach((user: any) => {
          const receiverSocket = user.socket;
          receiverSocket.emit("get-notification", data);
        });
      }
    } catch (error: any) {
      console.log(error.message);
    }
  });
};
