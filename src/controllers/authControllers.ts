import { conf } from "../conf/conf.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import {
    sendActivationNotificationEmail,
    sendActivationURLEmail,
} from "../services/email/emailService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { isPasswordStrong } from "../utils/checkPasswordStrength.js";

interface userData {
    email: string;
}

declare module "express-serve-static-core" {
    interface Request {
        userData?: userData;
    }
}

// register user controller
const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { fName, lName, email, phone, password, confirmPassword } =
            req.body;

        // check if all fields are empty
        if (
            !fName &&
            !lName &&
            !email &&
            !phone &&
            !password &&
            !confirmPassword
        ) {
            return res
                .status(400)
                .json(new ApiError(400, "All fields are required"));
        }

        const isStrongPassword = isPasswordStrong(password);

        if (!isStrongPassword) {
            return res
                .status(400)
                .json(
                    new ApiError(
                        400,
                        "Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
                    )
                );
        }
        // check if password and confirm password match
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json(
                    new ApiError(
                        400,
                        "Confirm Password and password must match."
                    )
                );
        }

        // check if user already exists
        const existedUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existedUser) {
            return res
                .status(409)
                .json(
                    new ApiError(
                        409,
                        "User with this email or phone already exists."
                    )
                );
        }

        // create the user
        const user = await User.create({
            fName,
            lName,
            email,
            phone,
            password,
        });

        // remove the password field in res
        const createdUser = await User.findById(user._id).select("-password");
        // create a unique url

        const session = await Session.create({
            token: uuidv4(),
            assosciate: user.email,
        });

        if (!session) {
            return res
                .status(500)
                .json(new ApiError(500, "Failed to create session."));
        }

        const url = `${conf.rootUrl}/activate-user?sessionId=${session._id}&t=${session.token}`;

        // send this url to email service

        const emailID = await sendActivationURLEmail({
            email: user.email,
            url,
            fName: user.fName,
        });

        console.log("email ID", emailID);

        if (!emailID) {
            return res
                .status(500)
                .json(new ApiError(500, "Failed to send activation email."));
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    null,
                    "We have sent you the activation link. Please check your email and follow the instruction to activate your account."
                )
            );
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return next(new ApiError(500, "Server error registering user."));
    }
};

// activate user controller
const activateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the session id and token from the frontend
        const { sessionId, t } = req.body;

        // find the session in the database and verify and delete
        const session = await Session.findOneAndDelete({
            _id: sessionId,
            token: t,
        });

        if (!session) {
            return res
                .status(400)
                .json(new ApiError(400, "Invalid or expired session."));
        }

        // find the user with the associate email and verify and activate if the account exists
        const user = await User.findOneAndUpdate(
            {
                email: session.assosciate,
            },
            {
                status: "active",
            },
            {
                new: true,
            }
        );

        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found."));
        }

        sendActivationNotificationEmail({
            email: user.email,
            fName: user.fName,
            url: "",
        });

        return res
            .status(201)
            .json(
                new ApiResponse(201, user, "Account is activated successfully.")
            );
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return next(new ApiError(500, "Server error while activating user."));
    }
};

// login user controller
const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get email password
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(new ApiError(404, "All fields are required"));
        }

        // find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(404)
                .json(new ApiError(404, "User with the email doesnot exist."));
        }

        // check if password is correct
        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiError(401, "Invalid password."));
        }

        // generate access token and refresh token, store access token in session table and refresh token in users table
        const accessToken = user.generateAccessToken();

        await Session.create({
            token: accessToken,
            assosciate: user.email,
        });

        const refreshAccessToken = user.generateRefreshToken();

        await User.findOneAndUpdate(
            { email: user.email },
            { refreshJwt: refreshAccessToken }
        );

        const data = {
            accessToken,
            refreshAccessToken,
        };

        return res
            .status(200)
            .json(new ApiResponse(200, data, "Login Successful."));
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return next(new ApiError(500, "Server error while logging in."));
    }
};

// logoutuser controller
const logoutUser = async () => {};

// get user detail controller
const getUserDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const userData = req.userData;

        if (!userData) {
            return res.status(404).json(new ApiError(404, "User Not Found."));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(201, userData, "User Data Found Successfully.")
            );
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return next(
            new ApiError(500, "Server error while getting user detail.")
        );
    }
};

// refresh jwt controller
const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // check authorization for refresh token
        // check the payload decode it and get the user data and check if refresh token is in database
        // if refresh token is not valid or not in database send to login page
        // generate new access token store it in session storage

        const user = await User.findOne({ email: req.userData.email });

        const newAccessToken = user.generateAccessToken();

        // save accesstoken to db
        await Session.create({
            token: newAccessToken,
            email: user.email,
        });

        return res
            .status(201)
            .json(new ApiResponse(200, newAccessToken, "Token Refreshed"));
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return next(
            new ApiError(500, "Server error while renewing access token")
        );
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetail,
    refreshAccessToken,
    activateUser,
};
