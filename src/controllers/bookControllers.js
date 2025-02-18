import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// create book (admin only)
const createBook = async (req, res, next) => {
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

        return next(new ApiError(500, "Server error creating the book."));
    }
};

// update book (admin only)
const updateBook = async (req, res, next) => {
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
        return next(new ApiError(500, "Server error updating the book"));
    }
};

// delete a book (admin only)
const deleteBook = async (req, res, next) => {
    try {
        // get the id of the book from the req params
        const bookId = req.params.id;

        // check if the book exista
        const bookToDelete = await Book.findById({ _id: bookId });

        if (!bookToDelete) {
            throw new ApiError(404, "Book doesnot exists.");
        }

        // delete the book
        // const isDeleted = await Book.remove(bookToDelete); (deprecated)
        const deletionResult = await Book.deleteOne({ _id: bookId });

        if (deletionResult.deletedCount === 0) {
            throw new ApiError(400, "Book deletion was unsuccessful.");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(200, bookToDelete, "Book deleted successfully.")
            );
    } catch (error) {
        console.log(`Error deleting the book: ${error}`);
        return next(
            new ApiError(500, `Server error deleting the book: ${error}`)
        );
    }
};

// retrieve books by filters
const getBookByFilter = async (req, res, next) => {
    try {
        // get the filter from req query
        const filter = req.query;

        // find the book using the filter
        const books = await Book.find(filter);

        if (books.length === 0) {
            throw new ApiError(404, "Book not found");
        }

        return res
            .status(201)
            .json(new ApiResponse(200, books, "Book fetched successfully"));
    } catch (error) {
        console.error(`Error getting books by the filter: ${error}`);
        return next(
            new ApiError(
                500,
                `Server error while getting books by the filter: ${error}`
            )
        );
    }
};

// retrive the books by id
const getBookById = async (req, res, next) => {
    try {
        // get the id from req params
        const bookId = req.params.id;

        const books = await Book.findById({ _id: bookId });

        if (!books) {
            throw new ApiError(404, "Book not found");
        }

        return res
            .status(201)
            .json(new ApiResponse(200, books, "Book found successfully."));
    } catch (error) {
        console.log(`Error getting the book by id: ${error}`);
        return next(
            new ApiError(500, `Server Error while getting book by id: ${error}`)
        );
    }
};
export { createBook, updateBook, deleteBook, getBookByFilter, getBookById };
