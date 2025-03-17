import express from "express";
import cors from "cors";
import { conf } from "./conf/conf.js";
import { connectDb } from "./db/dbConfig.js";
import authRouter from "./routes/authRoutes.js";
import bookRouter from "./routes/bookRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoute.js";

const app = express();
const PORT = conf.port;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorMiddleware);
// auth routes
app.use("/api/v1/auth", authRouter);

// book routes
app.use("/api/v1/books", bookRouter);

// user routes
app.use("/api/v1/users", userRouter);
