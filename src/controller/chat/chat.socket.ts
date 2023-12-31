import { Socket } from "socket.io";
import { Chat } from "../../model/chat.model";
import { Room } from "../../model/room.model";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
export const chatSocket = async (socket: Socket, connectedUsers: any) => {
  socket.on("chat", async ({ data }: any) => {
    const { messageBy, messageTo, roomId, message, image } = data;
    //  find if they have already chat or not
    const findmessage = await Chat.findOne({ roomId });
    const room = await Room.findOne({ _id: roomId });

    const uploadDir = path.join(__dirname, "../../../uploaded_images");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir);
    }

    // Save the image in the uploaded_images directory
    if (!image) {
      const createChat = new Chat({
        messageBy: messageBy,
        messageTo: messageTo,
        message: message,
        roomId: roomId,
        date: new Date(),
      });
      await createChat.save();

      socket.to(roomId).emit("message", createChat);
    } else {
      const imageName = `image_${Date.now()}.jpg`;
      const imagePath = path.join(uploadDir, imageName);
      writeFileSync(imagePath, image);

      const createChat = new Chat({
        messageBy: messageBy,
        messageTo: messageTo,
        message: message,
        image: imageName,
        roomId: roomId,
        date: new Date(),
      });
      await createChat.save();

      socket.to(roomId).emit("message", createChat);
    }
  });
};
