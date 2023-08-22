import { Request, Response } from "express";
import { FriendRequest } from "../../model/friendRequest.model";

export const listPendingRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.query;
    const listRequest = await FriendRequest.find({
      requestTo: id,
      isAccepted: false,
    }).populate("requestBy");
    return res.json({ data: listRequest });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
    });
  }
};
export const listFriend = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.query;
    const listRequest = await FriendRequest.find({
      $or: [
        {
          requestTo: id,
        },
        { requestBy: id },
      ],
      isAccepted: true,
    })
      .populate("requestBy")
      .populate("requestTo");
    return res.json({ data: listRequest });
  } catch (error) {
    return res.status(500).json({
      message: "Error ",
    });
  }
};
