export interface Monitor {
    id: string;
    timeout: number;
    createdAt: Date;
    status: "up" | "down" | "paused";
    lastHeartbeat: Date;
    timerRef?: NodeJS.Timeout | null;
    alert_email: string;
}

export type ResponseData = { [key: string]: any }