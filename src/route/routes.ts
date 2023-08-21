import { Router } from "express";
import {
  getAllUser,
  login,
  register,
} from "../controller/auth/auth.controller";
import { getChat } from "../controller/chat/chat.controller";
import { findRoom } from "../controller/room/room.controller";
import { listRequest } from "../controller/requestFriend/requestFriend.controller";

const router = Router();
// user
router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUser);
//  chat
router.get("/chat-list", getChat);
//  room
router.post("/list-room", findRoom);
// request
router.get("/list-request", listRequest);

export { router };
