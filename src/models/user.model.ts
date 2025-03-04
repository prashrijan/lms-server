import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { conf } from "../conf/conf.js";

// Extend mongoose.Document to include methods
interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    fName: string;
    lName: string;
    email: string;
    password: string;
    phone: string;
    role: "admin" | "student";
    createdAt: Date;
    updatedAt: Date;
    refreshJwt: string;
    status: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
    {
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
            unique: true,
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
        refreshJwt: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            default: "inactive",
            enum: ["active", "inactive"],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving user to the database
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Validate password method
userSchema.methods.isPasswordCorrect = async function (
    password: string
): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function (): string {
    return jwt.sign({ email: this.email }, conf.jwtSecret, {
        expiresIn: conf.jwtExpiry,
    });
};

// generate refresh token
userSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign({ email: this.email }, conf.refreshJwtSecret, {
        expiresIn: conf.refreshJwtExpiry,
    });
};

export const User = mongoose.model<IUser>("User", userSchema);
