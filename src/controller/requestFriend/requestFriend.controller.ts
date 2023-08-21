import { Request, Response } from "express";
import { FriendRequest } from "../../model/friendRequest.model";

export const listRequest = async (
  res: Response,
  req: Request
): Promise<Response> => {
  try {
    const { id } = req.query;
    const listRequest = await FriendRequest.find({
      requestTo: id,
    });
    return res.json({ data: listRequest });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
