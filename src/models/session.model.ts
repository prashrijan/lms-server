import mongoose, { Schema } from "mongoose";

interface ISession extends Document {
    token: string;
    assosciate: string;
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
    },
    { timestamps: true }
);

export const Session = mongoose.model<ISession>("session", sessionSchema);
