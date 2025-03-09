import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { conf } from "../conf/conf.js";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/ApiError.js";

export interface AuthUser extends Request {
    userData?: {
        _id: mongoose.Types.ObjectId;
        fName: string;
        lName: string;
        email: string;
        password: string;
        phone: string;
        role: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    };
}

// authenticate user middleware
const authenticateUser = async (
    req: AuthUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the token from the header
        // check if the token is in database
        // decode the token from the database
        // get the user data from the token
        // send the user data to request body
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            return res
                .status(401)
                .json(new ApiError(401, "Access Token is missing"));
        }

        const accesstokenFromDb = await Session.findOne({ token: accessToken });

        if (!accesstokenFromDb) {
            return new ApiError(401, "Unauthorised request. Token not found");
        }

        const decoded = jwt.verify(
            accesstokenFromDb.token,
            conf.jwtSecret
        ) as jwt.JwtPayload;

        if (!decoded.email) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access. Invalid token 1",
            });
        }

        const userData = await User.findOne({
            email: decoded.email,
        }).select("-password -refreshJwt");

        if (!userData) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access. Invalid token 2 ",
            });
        }

        if (userData.status !== "active") {
            return res
                .status(403)
                .json(
                    new ApiError(
                        403,
                        "User is not authorized to get the profile"
                    )
                );
        }

        req.userData = userData;
        next();
    } catch (error) {
        console.error(`Error authenticating user: ${error}`);
        return res
            .status(500)
            .json(
                new ApiError(500, error.message ?? "Error validating token.")
            );
    }
};

// refresh token verification middleware
const refreshAuthenticate = async (
    req: AuthUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the refresh token from the headers
        const refreshToken = req.headers.authorization;
        if (!refreshToken) {
            return res
                .status(401)
                .json(new ApiError(401, "Refresh Token is missing"));
        }
        // decode the token and check if there is email
        const decoded = jwt.verify(
            refreshToken,
            conf.refreshJwtSecret
        ) as jwt.JwtPayload;

        if (!decoded.email) {
            return res
                .status(401)
                .json(
                    new ApiError(
                        401,
                        "Unauthorized access. Invalid refresh token"
                    )
                );
        }
        // check if user exists with the refresh token
        const user = await User.findOne({
            email: decoded.email,
            refreshJwt: refreshToken,
        });

        if (!user) {
            return res
                .status(401)
                .json(
                    new ApiError(
                        401,
                        "Unauthorized access. Invalid refresh token"
                    )
                );
        }

        // send the user data to the request body if everything is 200
        req.userData = user;
        next();
    } catch (error) {
        console.error(`Error authenticating user: ${error}`);
        return res
            .status(500)
            .json(new ApiError(500, "Error authenticating token"));
    }
};

// check if admin middleware
const isAdmin = async (
    req: AuthUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        if (req.userData?.role === "admin") {
            next();
        } else {
            return res.status(400).json({
                status: "error",
                message: "You are not authorised for this call.",
            });
        }
    } catch (error) {
        console.error(`Error checking admin: ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Errror while authenticating admin",
        });
    }
};

export { authenticateUser, refreshAuthenticate, isAdmin };
