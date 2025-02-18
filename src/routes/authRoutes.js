import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    renewJwt,
} from "../controllers/authController.js";
import {
    registerUserValidator,
    loginUserValidator,
} from "../middlewares/joiValidation.js";

const authRouter = express.Router();

// auth routes
authRouter.route("/register").post(registerUserValidator, registerUser);
authRouter.route("/login").post(loginUserValidator, loginUser);
authRouter.route("/logout").post(logoutUser);
authRouter.route("/renew-jwt").post(renewJwt);

export default authRouter;
