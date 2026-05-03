import {Router} from "express";
import {
    createMonitor, deleteMonitor, getAllMonitors, getMetrics,
    getMonitor, heartbeat, pauseMonitor
} from "../controller/monitors.controller";

const router = Router();

router.get("/", getAllMonitors);

router.post("/", createMonitor);

router.get("/metrics", getMetrics);

router.get("/:id", getMonitor);

router.delete("/:id", deleteMonitor);

router.post("/:id/heartbeat", heartbeat);

router.post("/:id/pause", pauseMonitor);


export default router;