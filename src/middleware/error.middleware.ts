import {Response, Request} from "express";

export class AppError extends Error {
    public statusCode: number;

    constructor(message: any, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function errorHandler(  err: any, __: Request, res: Response, _: any) {
    console.error(err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({error: err.message});
    } else {
        res.status(500).json({error: "Internal Server Error"});
    }
}

