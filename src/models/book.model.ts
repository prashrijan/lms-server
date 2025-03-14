import mongoose, { Schema } from "mongoose";

interface IBook extends Document {
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    thumbnail: string;
    description: string;
    isAvailable: boolean;
    expectedAvailable: Date | null;
    averageRating: number;
    genre: string;
    addedBy: {
        name: string;
        adminId: mongoose.Types.ObjectId;
    };
    lastUpdatedBy: {
        name: string;
        adminId: mongoose.Types.ObjectId;
    };
}

const bookSchema = new Schema<IBook>(
    {
        title: {
            type: String,
            required: true,
        },

        author: {
            type: String,
            required: true,
        },
        isbn: {
            type: String,
            required: true,
            immutable: true,
        },
        publishedYear: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        isAvailable: {
            type: Boolean,
            default: false,
        },
        expectedAvailable: {
            type: Date,
            default: null,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        genre: {
            type: String,
            required: true,
        },
        addedBy: {
            name: {
                type: String,
            },
            adminId: {
                type: mongoose.Types.ObjectId,
            },
        },
        lastUpdatedBy: {
            name: {
                type: String,
            },
            adminId: {
                type: mongoose.Types.ObjectId,
            },
        },
    },
    { timestamps: true }
);

export const Book = mongoose.model<IBook>("Book", bookSchema);
