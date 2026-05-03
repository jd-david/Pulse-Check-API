
import {sanitizeMonitorData} from "../utils/monitor.utils";
import {Monitor} from "../types/types";
import {AppError} from "../middleware/error.middleware";

const monitorStore = new Map<string, Monitor>();

export function getMonitor(id: string): Monitor {
    if (!id) {
        throw new AppError("Id is required", 400);
    }
    const monitor = monitorStore.get(id);
    if (!monitor) {
        throw new AppError(`Monitor with id ${id} does not exists`, 404);
    }
    return monitor;
}
export function getAllMonitors (){
    return Array.from(monitorStore.values()).map(sanitizeMonitorData);

}

export function monitorExists(id: string){
    return monitorStore.has(id);
}

export function setMonitor(monitor: Monitor): Monitor{
    if (!monitor.id) {
        throw new AppError("Id is required", 400);
    }
    const result=monitorStore.set(monitor.id, monitor);
    return  result.get(monitor.id)!;


}
export function deleteMonitor(id: string) {
    if (!id) {
        throw new AppError("Id is required", 400);
    }
    const result = monitorStore.delete(id);
    if (!result) {
        throw new AppError(`Monitor with id ${id} does not exists`, 404);
    }
}