import express from "express";
import { authenticateUser, isAdmin } from "../middlewares/authenticateUser.js";
import { createBookValidator } from "../middlewares/joiValidation.js";
import { createBook, updateBook } from "../controllers/bookControllers.js";

const bookRouter = express.Router();

// book routes
// private api
bookRouter
    .route("/create-book")
    .post(createBookValidator, authenticateUser, isAdmin, createBook);

bookRouter
    .route("/update-book/:id")
    .patch(authenticateUser, isAdmin, updateBook);
export default bookRouter;
