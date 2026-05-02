import express from "express";
import {errorHandler} from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
    res.send("Pulse Check API is running");
});

app.use(errorHandler);

export default app;