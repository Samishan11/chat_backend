import { Request, Response } from "express";
import { User } from "../../model/user.model";
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, fullname, password } = req.body;
  try {
    // Create a new user using the User model
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
      return res.json({ data: user, message: "User login sucessfully" });
    }
    return res.json({ message: "Error creating user" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await User.find();
    return res.json({ data: users });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
};
