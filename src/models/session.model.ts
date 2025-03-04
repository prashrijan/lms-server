import mongoose, { Schema } from "mongoose";

interface ISession extends Document {
    token: string;
    assosciate: string;
    expire: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        token: {
            type: String,
            required: true,
        },

        assosciate: {
            type: String,
            default: "",
        },
        expire: {
            type: Date,
            default: new Date(Date.now() + 3600000), // 1hr
            expires: 0,
            required: true,
        },
    },
    { timestamps: true }
);

export const Session = mongoose.model<ISession>("session", sessionSchema);
