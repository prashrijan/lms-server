import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
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
            default: true,
        },
        expectedAvailable: {
            type: Date,
            default: null,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Book = new mongoose.model("Book", bookSchema);
