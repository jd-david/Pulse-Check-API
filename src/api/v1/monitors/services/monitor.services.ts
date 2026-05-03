import {AppError} from "../../../../middleware/error.middleware";
import {Monitor, ResponseData} from "../../../../types/types";
import {deleteMonitor, getAllMonitors, getMonitor, monitorExists, setMonitor} from "../../../../store/monitor.store";
import {clearTimer, resetTimer, sanitizeMonitorData, startTimer} from "../../../../utils/monitor.utils";
import {getCSVMetricsSummary, logMetricToCSV} from "../../../../store/metrics.store";

export function getAllMonitorsHandler(): ResponseData {
    return {monitors: getAllMonitors()};
}

export function getMonitorHandler(id: string): ResponseData{
    const monitor = getMonitor(id);
    return sanitizeMonitorData(monitor);
}

export function createMonitorHandler(id: string, timeout: number, alert_email: string): ResponseData {
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
    logMetricToCSV("CREATED", id, `Timeout set to ${timeout}s`);
    return sanitizeMonitorData(monitor);
}

export function deleteMonitorHandler(id: string): ResponseData {
    const monitor = getMonitor(id);
    clearTimer(monitor);
    deleteMonitor(id);
    logMetricToCSV("DELETED", id, "Monitor deleted");
    return {
        message: `Monitor with id ${id} deleted successfully`
    };
}

export function heartbeatHandler(id: string): ResponseData {
    const monitor = getMonitor(id);
    setMonitor({...monitor, lastHeartbeat: new Date(), status: "up", timerRef: resetTimer(monitor)});
    logMetricToCSV("HEARTBEAT", id, "Heartbeat received on time");
    return {
        message: `Heartbeat of monitor ${id} successfully received`
    };
}

export function pauseMonitorHandler(id: string): ResponseData {
    const monitor = getMonitor(id);
    clearTimer(monitor);
    setMonitor({...monitor, status: "paused", timerRef: null});
    logMetricToCSV("PAUSED", id, "Monitor paused");
    return {
        message: `Monitor with id ${id} paused successfully`
    };
}

export async function getMetricsHandler() {
    const monitors = getAllMonitors();

    let up = 0, down = 0, paused = 0;
    monitors.forEach(m => {
        if (m.status === "up") up++;
        if (m.status === "down") down++;
        if (m.status === "paused") paused++;
    });

    const csvMetrics = await getCSVMetricsSummary();

    return {
        current_status: {
            active_devices: monitors.length,
            up,
            down,
            paused
        },
        historical_audit_log: csvMetrics
    };
}