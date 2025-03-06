import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    activateUser,
} from "../controllers/authControllers.js";
import {
    registerUserValidator,
    loginUserValidator,
    activateUserValidator,
} from "../middlewares/validations/auth/authValidation.js";
import { refreshAuthenticate } from "../middlewares/authenticateUser.js";

const authRouter = express.Router();

// auth routes

authRouter.route("/register").post(registerUserValidator, registerUser);
authRouter.route("/login").post(loginUserValidator, loginUser);
authRouter.route("/logout").post(logoutUser);
authRouter.route("/activate-user").post(activateUserValidator, activateUser);
authRouter.route("/refresh-token").get(refreshAuthenticate, refreshAccessToken);

export default authRouter;
