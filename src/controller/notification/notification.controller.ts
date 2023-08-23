import { Request, Response } from "express";
import { Notification } from "../../model/notification.model";

export const listNotification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.query;

    const count = await Notification.countDocuments({
      notificationTo: id,
      isSeen: false,
    });

    const list = await Notification.find({
      notificationTo: id,
    });
    return res.json({ data: list, count: count });
  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const notificationSeen = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { data } = req.body;
    const find = await Notification.find({
      _id: { $in: data },
      isSeen: false,
    });
    if (find) {
      await Notification.updateMany(
        {
          _id: { $in: data },
        },
        {
          $set: { isSeen: true },
        },
        { new: true }
      );
      return res.json({ message: "Update Notification" });
    }
    return res.json({ message: "Ok" });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
