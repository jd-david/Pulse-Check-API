import express from "express";
import {errorHandler} from "./middleware/error.middleware";
import monitorRoutes from "./api/v1/monitors/router/monitor.routes";

const app = express();

app.use(express.json());


app.get("/", (_, res) => {
    res.send("Pulse Check API is running");
});
app.use('/monitors', monitorRoutes);

app.use(errorHandler);

export default app;