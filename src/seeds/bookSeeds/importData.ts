import { connectDb } from "../../db/dbConfig.js";
import { Book } from "../../models/book.model";
import books from "./book-seed.js";

const importData = async () => {
    try {
        await connectDb();

        await Book.deleteMany({});
        await Book.insertMany(books);
    } catch (error) {
        console.log(error);
    }
};

importData();
