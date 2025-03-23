import { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import slugify from "slugify";
import { deleteFile, deleteUploadedFiles } from "../utils/fileUtil.js";
// create book (admin only)
const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    console.log(req.file);
    try {
        const {
            title,
            author,
            thumbnail,
            isbn,
            genre,
            publishedYear,
            isAvailable,
            averageRating,
            description,
        } = req.body;

        if (!req.file || !req.file.path) {
            return next(new ApiError(400, "File path is required."));
        }

        const { path } = req.file;

        const admin = req.userData;

        if (!admin) {
            return next(new ApiError(403, "Unauthorized access. Admins only."));
        }

        // check if all fields are empty
        if (
            !title &&
            !author &&
            !thumbnail &&
            !isbn &&
            !genre &&
            !publishedYear &&
            !isAvailable &&
            !averageRating
        ) {
            return new ApiError(400, "All fields are required.");
        }

        // create the book
        const book = await Book.create({
            title,
            author,
            thumbnail: path,
            isbn,
            genre,
            publishedYear,
            isAvailable,
            averageRating,
            description,
            addedBy: {
                name: `${admin.fName} ${admin.lName}`,
                adminId: admin._id,
            },
            lastUpdatedBy: {
                name: admin.fName,
                adminId: admin._id,
            },
            slug: slugify(title, {
                lower: true,
                trim: true,
            }),
        });

        if (!book) {
            return new ApiError(401, "Book creation unsuccessful.");
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
const updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the id
        const bookId = req.params.id;

        // get the updates

        let updateToMake = req.body;

        // if req contains files append the path to the updates
        if (req.file) {
            updateToMake.thumbnail = req.file.path;
        }
        // update slug
        if (Object.prototype.hasOwnProperty.call(updateToMake, "title")) {
            updateToMake.slug = slugify(updateToMake.title, {
                lower: true,
                trim: true,
            });
        }

        // update the book
        const update = await Book.findByIdAndUpdate(bookId, updateToMake, {
            new: true,
        });

        if (!update) {
            return new ApiError(400, "Error updating the book.");
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
const deleteBook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the id of the book from the req params
        const bookId = req.params.id;

        // check if the book exista
        const bookToDelete = await Book.findById({ _id: bookId });

        console.log(bookToDelete);

        if (!bookToDelete) {
            return new ApiError(404, "Book doesnot exists.");
        }

        deleteFile(bookToDelete.thumbnail);

        // delete the book
        // const isDeleted = await Book.remove(bookToDelete); (deprecated)
        const deletionResult = await Book.deleteOne({ _id: bookId });

        if (deletionResult.deletedCount === 0) {
            return new ApiError(400, "Book deletion was unsuccessful.");
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
const getBookByFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the filter from req query
        const filter = req.query;

        // find the book using the filter
        const books = await Book.find(filter);

        if (books.length === 0) {
            return new ApiError(404, "Book not found");
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
const getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        // get the id from req params
        const bookId = req.params.id;

        const books = await Book.findById({ _id: bookId });

        if (!books) {
            return new ApiError(404, "Book not found");
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

// get all active books for user
const getActiveBooksUser = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const books = await Book.find({
            isAvailable: "Active",
        });

        if (!books) {
            return new ApiError(404, "Book not found");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    books,
                    "Book for users found successfully."
                )
            );
    } catch (error) {
        console.log(`Error getting the active books for user : ${error}`);
        return next(
            new ApiError(
                500,
                `Server Error while getting active books for user: ${error}`
            )
        );
    }
};

// get all books for admin
const getAllBooksAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const books = await Book.find();
        if (!books) {
            return new ApiError(404, "Book not found");
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    200,
                    books,
                    "Book for admin found successfully."
                )
            );
    } catch (error) {
        console.log(`Error getting the books : ${error}`);
        return next(
            new ApiError(500, `Server Error while getting books: ${error}`)
        );
    }
};
export {
    createBook,
    updateBook,
    deleteBook,
    getBookByFilter,
    getBookById,
    getActiveBooksUser,
    getAllBooksAdmin,
};
