import mongoose from "mongoose";
import { conf } from "../conf/conf.js";

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(
            `${conf.dbUri}/${conf.dbName}`
        );
        connection && console.log(`Database is connected successfully.`);
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
    }
};
