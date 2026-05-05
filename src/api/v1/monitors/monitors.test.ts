import request from "supertest";
import app from "../../../app";

jest.mock("../../../store/metrics.store", () => ({
    initCSVStore: jest.fn(),
    logMetricToCSV: jest.fn(),
    getCSVMetricsSummary: jest.fn().mockResolvedValue({
        total_events_logged: 0,
        total_historical_alerts: 0,
        total_heartbeats_received: 0,
        latest_event: "No events yet"
    })
}));

describe("Pulse Check API Integration Tests", () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    const testMonitor = {
        id: "test-device-01",
        timeout: 60,
        alert_email: "test@critmon.com"
    };

    describe("POST /monitors (Registration)", () => {
        it("should register a new monitor successfully", async () => {
            const response = await request(app)
                .post("/monitors")
                .send(testMonitor);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id", testMonitor.id);
            expect(response.body).toHaveProperty("status", "up");
        });

        it("should return 400 if validation fails", async () => {
            const response = await request(app)
                .post("/monitors")
                .send({ id: "device-2", timeout: "sixty" });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error");
        });
    });

    describe("GET /monitors/:id", () => {
        it("should fetch an existing monitor", async () => {
            const response = await request(app).get(`/monitors/${testMonitor.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testMonitor.id);
        });

        it("should return 404 for a non-existent monitor", async () => {
            const response = await request(app).get("/monitors/fake-device-99");
            expect(response.status).toBe(404);
        });
    });

    describe("POST /monitors/:id/heartbeat", () => {
        it("should successfully process a heartbeat", async () => {
            const response = await request(app)
                .post(`/monitors/${testMonitor.id}/heartbeat`);

            expect(response.status).toBe(200);
            expect(response.body.message).toContain("successfully received");
        });
    });

    describe("POST /monitors/:id/pause", () => {
        it("should successfully pause a monitor", async () => {
            const response = await request(app)
                .post(`/monitors/${testMonitor.id}/pause`);

            expect(response.status).toBe(200);

            // Verify the status changed to paused
            const checkResponse = await request(app).get(`/monitors/${testMonitor.id}`);
            expect(checkResponse.body).toHaveProperty("status", "paused");
        });
    });

    describe("GET /monitors/metrics", () => {
        it("should retrieve combined in-memory and mocked CSV metrics", async () => {
            const response = await request(app).get("/monitors/metrics");
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("current_status");
            expect(response.body).toHaveProperty("historical_audit_log");

            // Should show at least 1 device since we registered one in the first test
            expect(response.body.current_status.active_devices).toBeGreaterThanOrEqual(1);
        });
    });
});