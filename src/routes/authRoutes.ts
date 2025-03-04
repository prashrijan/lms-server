import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getUserDetail,
    activateUser,
} from "../controllers/authControllers.js";
import {
    registerUserValidator,
    loginUserValidator,
} from "../middlewares/joiValidation.js";
import {
    authenticateUser,
    refreshAuthenticate,
} from "../middlewares/authenticateUser.js";

const authRouter = express.Router();

// auth routes
authRouter.route("/").get(authenticateUser, getUserDetail);
authRouter.route("/register").post(registerUserValidator, registerUser);
authRouter.route("/login").post(loginUserValidator, loginUser);
authRouter.route("/logout").post(logoutUser);
authRouter.route("/activate-user").post(activateUser);
authRouter.route("/refresh-token").get(refreshAuthenticate, refreshAccessToken);

export default authRouter;
