import express from "express";
import { getUserProfile } from "../controllers/userController";
import { authenticateUser } from "../middlewares/authenticateUser";

const userRouter = express.Router();

userRouter.route("/profile").get(authenticateUser, getUserProfile);

export default userRouter;
