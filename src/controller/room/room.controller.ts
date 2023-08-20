import { Request, Response } from "express";
import { Room } from "../../model/room.model";

export const findRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { users } = req.body;
    const room = await Room.findOne({
      users: { $in: users },
    });
    return res.json({ data: room });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
