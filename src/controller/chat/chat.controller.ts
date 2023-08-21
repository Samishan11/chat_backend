import { Request, Response } from "express";
import { Chat } from "../../model/chat.model";

export const getChat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomId } = req.query;
    const findmessage = await Chat.find({ roomId });
    return res.json({ data: findmessage });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};

// const findmessage = await Chat.find({
//     $or: [
//       { messageBy, messageTo },
//       { messageBy: messageTo, messageTo: messageBy },
//     ],
//   });
