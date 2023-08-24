import { Request, Response } from "express";
import { User } from "../../model/user.model";
import { FriendRequest } from "../../model/friendRequest.model";
import { generateAccessToken } from "../../middlware/auth.middleware";
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, fullname, password } = req.body;
  try {
    // Create a new user using the User model
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        message: "User already exist",
      });
    }
    await User.create({ username, email, fullname, password });
    return res.json({
      message: "User Created",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Username or password not match." });
    }

    if (user && (await user.matchPassword(password))) {
      var token = await generateAccessToken({ data: user });
      return res.json({
        data: user,
        message: "User login sucessfully",
        token,
      });
    }
    return res.json({ message: "username or password not match" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};

export const getAllUser = async (
  req: Request & { user?: any },
  res: Response
): Promise<Response> => {
  try {
    const { _id } = req.user;

    const users = await User.find({
      _id: {
        $ne: _id,
      },
    });

    const listRequest = await FriendRequest.find({
      $or: [
        {
          requestTo: _id,
        },
        { requestBy: _id },
      ],
      isAccepted: true,
    });

    const getFriendIds = listRequest?.map((x: any) => {
      if (x.requestBy.toString() === _id.toString()) {
        return x.requestTo;
      }
      return x.requestBy;
    });

    const notFriend = users.filter((x: any) => {
      return getFriendIds.every(
        (friendId) => friendId.toString() !== x._id.toString()
      );
    });
    return res.json({ data: notFriend });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};
