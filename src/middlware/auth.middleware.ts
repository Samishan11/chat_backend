import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model";

const ACCESS_TOKEN_KEY = "accesstoken";

export const authMiddleware = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let accessToken: string | undefined = req.header("authorization");

    if (!accessToken) {
      res.status(401).json({ message: "Unauthorized user" });
      return;
    }
    accessToken = accessToken?.substr(7, accessToken?.length);

    const _res = jwt.verify(accessToken, ACCESS_TOKEN_KEY) as {
      data: { email: string };
    };

    User.findOne({ email: _res?.data?.email }).then((result: any) => {
      req.user = result;
      next();
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const generateAccessToken = async (data: any): Promise<string> => {
  try {
    const accessToken = jwt.sign(data, ACCESS_TOKEN_KEY, { expiresIn: "10d" });
    return accessToken;
  } catch (error) {
    throw error;
  }
};
