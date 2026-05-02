import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server= app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (reason: Error | any) => {
    console.error(`UNHANDLED REJECTION! with reason ${reason}`);
    server.close(() => {
        process.exit(1);
    });
});