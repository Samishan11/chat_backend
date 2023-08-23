import { Router } from "express";
import {
  getAllUser,
  login,
  register,
} from "../controller/auth/auth.controller";
import { getChat } from "../controller/chat/chat.controller";
import { findRoom } from "../controller/room/room.controller";
import {
  listFriend,
  listPendingRequest,
} from "../controller/requestFriend/requestFriend.controller";
import {
  listNotification,
  notificationSeen,
} from "../controller/notification/notification.controller";
import { authMiddleware } from "../middlware/auth.middleware";

const router = Router();
// user
router.post("/register", register);
router.post("/login", login);

router.get("/users", authMiddleware, getAllUser);
//  chat
router.get("/chat-list", authMiddleware, getChat);
//  room
router.post("/list-room", authMiddleware, findRoom);
// request
router.get("/list-request", authMiddleware, listPendingRequest);
router.get("/list-friend", authMiddleware, listFriend);
//  notification
router.get("/list-notification", authMiddleware, listNotification);
router.patch("/clear-notification", authMiddleware, notificationSeen);

export { router };
