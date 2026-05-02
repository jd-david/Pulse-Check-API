import {Monitor} from "../types/types";

export function startTimer(monitor: Monitor) {
    return setTimeout(() => {
        monitor.status = "down";
        console.log({
            ALERT: `Device ${monitor.id} is down!`,
            time: new Date().toISOString()
        });
    }, monitor.timeout * 1000);
}

export function clearTimer(monitor: Monitor) {
    if (monitor.timerRef === null) {
        return;
    }
    clearTimeout(monitor.timerRef);
}

export function resetTimer(monitor: Monitor) {
    clearTimer(monitor);
    return startTimer(monitor);
}


export function sanitizeMonitorData(monitor: Monitor) {
    const {timerRef, lastHeartbeat, ...rest} = monitor;
    return rest;
}