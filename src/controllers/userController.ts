import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { AuthUser } from "../middlewares/authenticateUser.js";

const getUserProfile = async (
    req: AuthUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const userData = req.userData;

        if (!userData) {
            return res
                .status(404)
                .json(new ApiError(404, "User data not found"));
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, userData, "User data found successfully")
            );
    } catch (error) {
        console.error(`Internal Server Error: ${error}`);
        return next(
            new ApiError(500, "Server error getting user profile.", error)
        );
    }
};

export { getUserProfile };
