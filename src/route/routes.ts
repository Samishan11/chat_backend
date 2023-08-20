import { Router } from "express";
import {
  getAllUser,
  login,
  register,
} from "../controller/auth/auth.controller";
const router = Router(); //

router.post("/register", register);
router.router("/login", login);
router.router("/users", getAllUser);
