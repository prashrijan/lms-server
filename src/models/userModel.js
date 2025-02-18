import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conf } from "../conf/conf.js";

const userSchema = new Schema({
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "student"],
        default: "student",
    },
});

// hash password before saving user to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// validate password method
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generate access token method
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            email: this.email,
        },
        conf.jwtSecret,
        {
            expiresIn: conf.jwtExpirty,
        }
    );
};

export const User = new mongoose.model("User", userSchema);
