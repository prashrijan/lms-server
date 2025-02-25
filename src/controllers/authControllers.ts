import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NextFunction, Request, Response } from "express";

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
            throw new ApiError(400, "All fields are required");
        }

        // check if password and confirm password match
        if (password !== confirmPassword) {
            throw new ApiError(
                400,
                "Confirm Password and password must match."
            );
        }

        // check if user already exists
        const existedUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existedUser) {
            throw new ApiError(
                409,
                "User with this email or phone already exists."
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

        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    createdUser,
                    "User registered successfully."
                )
            );
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return next(new ApiError(500, "Server error registering user."));
    }
};

// login user controller
const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const { email, password } = req.body;

        // check if all fields are empty
        if (!email && !password) {
            throw new ApiError(400, "All fields are required.");
        }

        // find the user
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User doesnot exists.");
        }

        // check the password
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password.");
        }

        // generate access token
        const accessToken = user.generateAccessToken();

        // generate refresh token
        const refreshToken = user.generateRefreshToken();
        await User.findOneAndUpdate(
            { email: user.email },
            { refreshJwt: refreshToken }
        );

        const foundUser = await User.findById(user._id).select("-password");

        const data = {
            accessToken,
            refreshToken,
            user: foundUser,
        };

        return res
            .status(201)
            .json(new ApiResponse(200, data, "Login Successfully"));
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
            throw new ApiError(404, "User Not Found.");
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
};
