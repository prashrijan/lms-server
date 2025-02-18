import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// create book (admin only)
const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            thumbnail,
            isbn,
            genre,
            publishedYear,
            availability,
            status,
            averageRating,
            description,
        } = req.body;

        // check if all fields are empty
        if (
            !title &&
            !author &&
            !thumbnail &&
            !isbn &&
            !genre &&
            !publishedYear &&
            !availability &&
            !status &&
            !averageRating
        ) {
            throw new ApiError(400, "All fields are required.");
        }

        // create the book
        const book = await Book.create({
            title,
            author,
            thumbnail,
            isbn,
            genre,
            publishedYear,
            availability,
            status,
            averageRating,
            description,
        });

        if (!book) {
            throw new ApiError(401, "Book creation unsuccessful.");
        }

        return res
            .status(200)
            .json(new ApiResponse(201, book, "Book created successfully"));
    } catch (error) {
        console.log(`Error creating book: ${error}`);

        throw new ApiError(500, "Server error creating the book.");
    }
};

// update book (admin only)
const updateBook = async (req, res) => {
    try {
        // get the id
        const bookId = req.params.id;

        // get the updates
        const updateToMake = req.body;

        // update the book
        const update = await Book.findByIdAndUpdate(bookId, updateToMake, {
            new: true,
        });

        if (!update) {
            throw new ApiError(400, "Error updating the book.");
        }

        return res
            .status(200)
            .json(new ApiResponse(201, update, "Book updated successfully."));
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Server error updating the book");
    }
};

// delete a book (admin only)
const deleteBook = async (req, res) => {
    try {
    } catch (error) {}
};

export { createBook, updateBook };
