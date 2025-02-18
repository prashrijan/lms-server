import express from "express";
import cors from "cors";
import { conf } from "./src/conf/conf.js";
import { connectDb } from "./src/db/dbConfig.js";
import authRouter from "./src/routes/authRoutes.js";
import bookRouter from "./src/routes/bookRoutes.js";

const app = express();
const PORT = conf.port;

app.use(cors());
app.use(express.json());

// database connection
connectDb()
    .then((_) => console.log(`Database connected to the server`))
    .then(() => {
        app.listen(PORT, () => {
            try {
                console.log(
                    `Server is ready and listening at port http://localhost:${PORT}`
                );
            } catch (error) {
                console.log(`Error connecting to the server: ${error}`);
            }
        });
    })
    .catch((err) => `Error connecting database to the server: ${err}`);

// auth routes
app.use("/api/v1/auth", authRouter);

// book routes
app.use("/api/v1/books", bookRouter);
