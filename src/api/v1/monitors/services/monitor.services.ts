import {deleteMonitor, getAllMonitors, getMonitor, monitorExists, setMonitor} from "../../../../store/monitor.store.js";
import {clearTimer, resetTimer, sanitizeMonitorData, startTimer} from "../../../../utils/monitor.utils.js";
import {AppError} from "../../../../middleware/error.middleware";
import {Monitor, ResponseData} from "../../../../types/types";

export async function getAllMonitorsHandler(): Promise<ResponseData> {
    return {monitors: getAllMonitors()};
}

export async function getMonitorHandler(id: string): Promise<ResponseData> {
    const monitor = getMonitor(id);
    return sanitizeMonitorData(monitor);
}

export async function createMonitorHandler(id: string, timeout: number, alert_email: string): Promise<ResponseData> {
    if (monitorExists(id)) {
        throw new AppError(`Monitor with id ${id} already exists`, 409);
    }
    const monitor: Monitor = {
        id,
        timeout,
        alert_email,
        createdAt: new Date(),
        status: "up",
        lastHeartbeat: new Date(),
    };
    monitor.timerRef = startTimer(monitor);
    setMonitor(monitor);
    return sanitizeMonitorData(monitor);
}

export async function deleteMonitorHandler(id: string): Promise<ResponseData> {
    const monitor = getMonitor(id);
    clearTimer(monitor);
    deleteMonitor(id);
    return {
        message: `Monitor with id ${id} deleted successfully`
    };
}

export async function heartbeatHandler(id: string): Promise<ResponseData> {
    const monitor = getMonitor(id);
    setMonitor({...monitor, lastHeartbeat: new Date(), status: "up", timerRef: resetTimer(monitor)});
    return {
        message: `Heartbeat of monitor ${id} successfully received`
    };
}

export async function pauseMonitorHandler(id: string): Promise<ResponseData> {
    const monitor = getMonitor(id);
    clearTimer(monitor);
    setMonitor({...monitor, status: "paused", timerRef: null});
    return {
        message: `Monitor with id ${id} paused successfully`
    };
}