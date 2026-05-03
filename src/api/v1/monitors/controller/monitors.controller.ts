import type {Response, Request, NextFunction} from 'express';
import {
    createMonitorHandler, deleteMonitorHandler, getAllMonitorsHandler, getMetricsHandler,
    getMonitorHandler, heartbeatHandler, pauseMonitorHandler
} from "../services/monitor.services";
import {AppError} from "../../../../middleware/error.middleware";

export const getAllMonitors = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const allMonitors = getAllMonitorsHandler();
        res.status(200).json(allMonitors);
    } catch (err) {
        next(err);
    }
}

export const getMonitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params as { id: string };
        const monitor = getMonitorHandler(id);
        res.status(200).json(monitor);
    } catch (err) {
        next(err);
    }

}

export const createMonitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, timeout, alert_email} = req.body || {};

        if (!id || typeof id !== "string" || id.trim() === "") {
            throw new AppError("Invalid or missing 'id'. Must be a non-empty string.", 400);
        }

        // --- 2. VALIDATE 'timeout' ---
        if (!timeout || typeof timeout !== "number" || timeout <= 0) {
            throw new AppError("Invalid or missing 'timeout'. Must be a positive number in seconds.", 400);
        }

        // --- 3. VALIDATE 'alert_email' ---
        // Simple regex to check for valid email format (e.g., test@example.com)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!alert_email || typeof alert_email !== "string" || !emailRegex.test(alert_email)) {
            throw new AppError("Invalid or missing 'alert_email'. Must be a valid email address.", 400);
        }

        const monitor = createMonitorHandler(id, timeout, alert_email);
        res.status(201).json(monitor);
    } catch (err) {
        next(err);
    }
}

export const deleteMonitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params as { id: string };
        const result = deleteMonitorHandler(id);
        res.status(200).json(result);
    } catch (err) {
        next(err);

    }

}

export const heartbeat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params as { id: string };
        const result = heartbeatHandler(id);
        res.status(200).json(result);
    } catch (err) {
        next(err);

    }

}

export const pauseMonitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params as { id: string };
        const result = pauseMonitorHandler(id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }

}

export const getMetrics= async (_: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const metrics = await getMetricsHandler();
        res.status(200).json(metrics);
    } catch (err) {
        next(err);
    }
}