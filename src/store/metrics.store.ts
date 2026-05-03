import fs from "fs/promises";
import path from "path";

const CSV_FILE_PATH = path.resolve(process.cwd(), "metrics_audit.csv");

export async function initCSVStore() {
    try {
        await fs.access(CSV_FILE_PATH);
    } catch {
        const headers = "Timestamp,EventType,DeviceID,Message\n";
        await fs.writeFile(CSV_FILE_PATH, headers, "utf8");
    }
}

export async function logMetricToCSV(eventType: "HEARTBEAT" | "ALERT_DOWN" | "CREATED" | "PAUSED"|"DELETED", deviceId: string, message: string) {
    const timestamp = new Date().toISOString();
    const safeMessage = message.replace(/,/g, ";");
    const row = `${timestamp},${eventType},${deviceId},${safeMessage}\n`;

    try {
        await fs.appendFile(CSV_FILE_PATH, row, "utf8");
    } catch (error) {
        console.error(`Failed to write metric to CSV for device ${deviceId}`, error);
    }
}

export async function getCSVMetricsSummary() {
    try {
        const data = await fs.readFile(CSV_FILE_PATH, "utf8");
        const lines = data.trim().split("\n");
        const rows = lines.slice(1);

        let totalAlerts = 0;
        let totalHeartbeats = 0;

        rows.forEach(row => {
            const columns = row.split(",");
            if (columns[1] === "ALERT_DOWN") totalAlerts++;
            if (columns[1] === "HEARTBEAT") totalHeartbeats++;
        });

        return {
            total_events_logged: rows.length,
            total_historical_alerts: totalAlerts,
            total_heartbeats_received: totalHeartbeats,
            latest_event: rows.length > 0 ? rows[rows.length - 1] : "No events yet"
        };
    } catch (error) {
        return { error: "Could not read CSV metrics" };
    }
}