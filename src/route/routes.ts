import { Router } from "express";
import {
  getAllUser,
  login,
  register,
} from "../controller/auth/auth.controller";
import { getChat } from "../controller/chat/chat.controller";
import { findRoom } from "../controller/room/room.controller";

const router = Router(); //
router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUser);
router.get("/chat-list", getChat);
router.post("/list-room", findRoom);

export { router };
