import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { conf } from "../conf/conf.js";

const authenticateUser = async (req, res, next) => {
    try {
        // get the token from the header
        // decode the token
        // get the user data from the token
        // send the user data to request body
        const accessToken = req.headers.authorization;
        const decoded = jwt.verify(accessToken, conf.jwtSecret);

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
            message: "Error authenticating token",
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (req.userData.role === "admin") {
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

export { authenticateUser, isAdmin };
