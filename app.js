import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/api/healthcheck", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    try {
        console.log(
            `Server is ready and listening at port http://localhost:${PORT}`
        );
    } catch (error) {
        console.log(`Error connecting to the server: ${error}`);
    }
});
