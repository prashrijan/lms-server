import mongoose, { Schema } from "mongoose";

interface IBorrow extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    bookId: mongoose.Types.ObjectId;
    borrowDate: Date;
    dueDate: Date;
    returnDate: Date;
    status: "borrowed" | "returned";
    isReviewed: boolean;
    reviewId: mongoose.Types.ObjectId;
}

const BorrowSchema = new Schema<IBorrow>(
    {
        userId: {
            types: Schema.Types.ObjectId,
            ref: "User",
        },
        bookId: {
            types: Schema.Types.ObjectId,
            ref: "Book",
        },
        borrowDate: {
            types: Date,
            required: true,
        },
        dueDate: {
            types: Date,
            required: true,
        },
        status: {
            types: String,
            enum: ["borrowed", "returned"],
        },
        isReviewed: {
            types: Boolean,
            default: false,
        },
        reviewId: {
            types: Schema.Types.ObjectId,
            ref: "Review",
        },
    },
    { timestamps: true }
);

export const Borrow = mongoose.model<IBorrow>("Borrow", BorrowSchema);
