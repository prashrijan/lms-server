import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { conf } from "../conf/conf.js";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Session } from "../models/session.model.js";
import { ApiError } from "../utils/ApiError.js";

interface AuthUser extends Request {
    userData?: {
        _id: mongoose.Types.ObjectId;
        fName: string;
        lName: string;
        email: string;
        password: string;
        phone: string;
        role: string;
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
        // decode the token
        // get the user data from the token
        // send the user data to request body
        const accessToken = req.headers.authorization;

        const accesstokenFromDb = await Session.findOne({ token: accessToken });
        console.log(accesstokenFromDb);

        if (!accesstokenFromDb) {
            throw new ApiError(401, "Unauthorised request. Token not found");
        }

        const decoded = jwt.verify(accesstokenFromDb.token, conf.jwtSecret);

        if (!decoded?.email) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access. Invalid token 1",
            });
        }

        const userData = await User.findOne({
            email: decoded.email,
        });

        if (!userData) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access. Invalid token 2 ",
            });
        }

        req.userData = userData;
        next();
    } catch (error) {
        console.error(`Error authenticating user: ${error}`);
        return res.status(500).json({
            status: "error",
            message: error?.message ?? "Error validating Token",
        });
    }
};

// refresh token verification middleware
const refreshAuthenticate = async (
    req: AuthUser,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the token from the header
        // decode the token
        // get the user data from the token
        // send the user data to request body
        const refreshToken = req.headers.authorization;

        const decoded = jwt.verify(refreshToken, conf.refreshJwtSecret);

        if (!decoded?.email) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access. Invalid token",
            });
        }

        const userData = await User.findOne({
            email: decoded.email,
        });

        if (!userData && userData.refreshJwt != refreshToken) {
            return res.status(401).json({
                status: "error",
                message: "Unauthorized access. Invalid token 2 ",
            });
        }

        req.userData = userData;
        next();
    } catch (error) {
        console.error(`Error authenticating user: ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Error authenticating token",
        });
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
