import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminStore } from "../../api/_lib/admin-store";
import {
  createAdminDependencies,
  handleAdminLeadsRequest,
  handleAdminStatsRequest,
  handleTrackEventRequest,
} from "../../api/_lib/admin-handlers";

function createAdminStoreMock(): AdminStore {
  return {
    recordAnalyticsEvent: vi.fn(),
    getDashboard: vi.fn(),
    listLeads: vi.fn(),
  };
}

describe("admin handlers", () => {
  let adminStore: AdminStore;

  beforeEach(() => {
    adminStore = createAdminStoreMock();
    process.env.ADMIN_TOKEN = "admin_test_token";
  });

  it("rejects stats requests without a valid admin token", async () => {
    const response = await handleAdminStatsRequest(
      { range_days: "30" },
      {},
      createAdminDependencies({ adminStore }),
    );

    expect(response).toEqual({
      status: 401,
      json: { error: "Unauthorized" },
    });
  });

  it("returns dashboard stats when token is valid", async () => {
    vi.mocked(adminStore.getDashboard).mockResolvedValue({
      rangeDays: 30,
      period: {
        visitors: 120,
        waitlistLeads: 24,
        checkoutStarted: 8,
        paidMembers: 2,
        waitlistConversionRate: 0.2,
        leadToPaidConversionRate: 0.0833,
        visitorToPaidConversionRate: 0.0167,
      },
      lifetime: {
        visitors: 500,
        waitlistLeads: 80,
        checkoutStarted: 30,
        paidMembers: 12,
        latestMemberId: "012",
      },
      updatedAt: "2026-04-15T00:00:00.000Z",
    });

    const response = await handleAdminStatsRequest(
      { range_days: "30" },
      { "x-admin-token": "admin_test_token" },
      createAdminDependencies({ adminStore }),
    );

    expect(response.status).toBe(200);
    expect(adminStore.getDashboard).toHaveBeenCalledWith({ rangeDays: 30 });
  });

  it("returns leads when token is valid", async () => {
    vi.mocked(adminStore.listLeads).mockResolvedValue([
      {
        email: "founder@example.com",
        memberId: "001",
        paid: true,
        priorityAccess: true,
        checkoutStatus: "completed",
        createdAt: "2026-04-15T00:00:00.000Z",
        checkoutStartedAt: "2026-04-15T00:00:00.000Z",
        paidAt: "2026-04-15T00:00:00.000Z",
      },
    ]);

    const response = await handleAdminLeadsRequest(
      { limit: "50" },
      { authorization: "Bearer admin_test_token" },
      createAdminDependencies({ adminStore }),
    );

    expect(response.status).toBe(200);
    expect(adminStore.listLeads).toHaveBeenCalledWith({ limit: 50 });
  });

  it("records supported analytics events", async () => {
    const response = await handleTrackEventRequest(
      {
        event: "waitlist_submit",
        sessionId: "session_123",
        email: "founder@example.com",
        path: "/",
      },
      createAdminDependencies({ adminStore }),
    );

    expect(response).toEqual({
      status: 202,
      json: { success: true },
    });
    expect(adminStore.recordAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "waitlist_submit",
        sessionId: "session_123",
        email: "founder@example.com",
      }),
    );
  });

  it("rejects unsupported analytics events", async () => {
    const response = await handleTrackEventRequest(
      {
        event: "unknown_event",
        sessionId: "session_123",
      },
      createAdminDependencies({ adminStore }),
    );

    expect(response).toEqual({
      status: 400,
      json: { error: "Unsupported event." },
    });
  });
});
