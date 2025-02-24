import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NextFunction, Request, Response } from "express";

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

        const foundUser = await User.findById(user._id).select("-password");

        const data = {
            accessToken,
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

// renew jwt
const refreshAccessToken = async () => {};

export { registerUser, loginUser, logoutUser, refreshAccessToken };
