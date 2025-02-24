import express from "express";
import { authenticateUser, isAdmin } from "../middlewares/authenticateUser.js";
import { createBookValidator } from "../middlewares/joiValidation.js";
import {
    createBook,
    deleteBook,
    getBookByFilter,
    updateBook,
    getBookById,
    getActiveBooksUser,
    getAllBooksAdmin,
} from "../controllers/bookControllers.js";

const bookRouter = express.Router();

// book routes
// private api
bookRouter
    .route("/create-book")
    .post(authenticateUser, isAdmin, createBookValidator, createBook);

bookRouter
    .route("/update-book/:id")
    .patch(authenticateUser, isAdmin, updateBook);

bookRouter
    .route("/delete-book/:id")
    .delete(authenticateUser, isAdmin, deleteBook);

bookRouter
    .route("/get-books-admin")
    .get(authenticateUser, isAdmin, getAllBooksAdmin);

// public api
bookRouter.route("/get-book/?query").get(getBookByFilter);
bookRouter.route("/get-book/:id").get(getBookById);
bookRouter.route("/get-books-user").get(getActiveBooksUser);

export default bookRouter;
