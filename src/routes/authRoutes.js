import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
} from "../controllers/authControllers.js";
import {
    registerUserValidator,
    loginUserValidator,
} from "../middlewares/joiValidation.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticateUser.js";

const authRouter = express.Router();

// auth routes
authRouter.route("/register").post(registerUserValidator, registerUser);
authRouter.route("/login").post(loginUserValidator, loginUser);
authRouter.route("/logout").post(logoutUser);
authRouter.route("/refersh-token").post(refreshAccessToken);

export default authRouter;
