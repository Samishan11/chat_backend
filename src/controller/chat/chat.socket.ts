import { Socket } from "socket.io";
import { Chat } from "../../model/chat.model";
import { Room } from "../../model/room.model";

export const chatSocket = async (socket: Socket, connectedUsers: any) => {
  socket.on("chat", async ({ data }: any) => {
    const { messageBy, messageTo, roomId, message } = data;
    console.log(data)
    //  find if they have already chat or not
    const findmessage = await Chat.findOne({ roomId });
    const room = await Room.findOne({ _id: roomId });
    // if (!findmessage) {
    //   //  if first message create room
    //   const createRoom = new Room({
    //     users: [messageBy, messageTo],
    //     isGroup: false,
    //   });
    //   await createRoom.save();
    //   //   create a chat
    //   const createChat = new Chat({
    //     messageBy: messageBy,
    //     messageTo: messageTo,
    //     message: message,
    //     roomId: createRoom._id,
    //     date: new Date().toDateString(),
    //   });
    //   await createChat.save();
    //   // const matchingUsers = Array.from(connectedUsers.values()).filter(
    //   //   (user: any) => createRoom.users.includes(user.userId)
    //   // );
    //   // matchingUsers.forEach((user: any) => {
    //   //   const receiverSocket = user.socket;
    //   //   console.log(receiverSocket);
    //   //   receiverSocket.emit("message", createChat);
    //   //   // return socket.to(roomId).emit("message", createChat);
    //   // });
    //   return socket.to(createRoom._id.toString()).emit("message", createChat);
    // }
    const createChat = new Chat({
      messageBy: messageBy,
      messageTo: messageTo,
      message: message,
      roomId: roomId,
      date: new Date().toDateString(),
    });
    await createChat.save();
    // const matchingUsers = Array.from(connectedUsers.values()).filter(
    //   (user: any) => room?.users.includes(user.userId)
    // );
    // matchingUsers.forEach((user: any) => {
    //   const receiverSocket = user.socket;
    //   socket.to(receiverSocket).emit("message", createChat);
    //   // return socket.to(roomId).emit("message", createChat);
    // });
    return socket.to(roomId).emit("message", createChat);
  });
};
